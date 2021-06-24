const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const InvalidDataError = require('../errors/invalid-data');
const AlreadyExistsError = require('../errors/already-exists');
const IncorrectTokenError = require('../errors/incorrect-token');

const User = require('../models/user');
const NoIdFoundError = require('../errors/not-found');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.patchUser = (req, res, next) => {
  const { name, email } = req.body;
  if (!name || !email) {
    next(new InvalidDataError('Не переданно одно из полей'));
  } else {
    User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      {
        new: true,
        runValidators: true,
        upsert: false,
      },
    )
      .orFail(new NoIdFoundError('Пользователь с таким ID не найден'))
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === 'CastError') {
          next(new InvalidDataError('Передан невалидный ID'));
        } else if (err.name === 'ValidationError') {
          next(new InvalidDataError(err.message));
        } else {
          next(err);
        }
      });
  }
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }).then((user) => res.status(200).send({
      data: {
        name: user.name,
        email: user.email,
      },
    })))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidDataError(err.message));
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(
          new AlreadyExistsError(
            'Пользователь с переданным email уже существует',
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new InvalidDataError('Не передан email или пароль'));
  }
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new InvalidDataError('Неправильная почта или пароль'),
        );
      }
      bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(
              new InvalidDataError('Неправильная почта или пароль'),
            );
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            { expiresIn: '7d' },
          );
          res.send({ _id: user._id, token });
        })
        .catch((err) => next(new IncorrectTokenError(err.message)));
    })
    .catch((err) => next(new IncorrectTokenError(err.message)));
};

module.exports.getUserInfo = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail(new NoIdFoundError('Пользователь с таким ID не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidDataError('Передан невалидный ID'));
      } else {
        next(err);
      }
    });
};
