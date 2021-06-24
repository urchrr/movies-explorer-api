const jwt = require('jsonwebtoken');
const IncorrectTokenError = require('../errors/incorrect-token');
const NoAccessError = require('../errors/no-access');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.headers.authorization.replace('Bearer ', '');
  if (!token) {
    next(new IncorrectTokenError('необходима авторизация'));
  }
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    next(new IncorrectTokenError('необходима авторизация'));
  }

  req.user = payload;

  next();
};
