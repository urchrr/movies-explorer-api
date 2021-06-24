const InvalidDataError = require('../errors/invalid-data');
const NoIdFoundError = require('../errors/not-found');
const NoAccessError = require('../errors/no-access');

const Movies = require('../models/movie');

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movies.find({})
    .then((movies) => {
      const usersMovies = Array.from(movies).filter((i) => i.owner._id.toString() === owner);
      res.status(200).send(usersMovies);
    })
    .catch((err) => next(err));
};

module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movies.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => next(err));
};

module.exports.deleteMovie = (req, res, next) => {
  const { _id } = req.params;
  Movies.findById(_id)
    .orFail(new NoIdFoundError('Фильм с таким ID не найден'))
    .then((movie) => {
      if (movie.owner._id.toString() === req.user._id) {
        Movies.findByIdAndRemove(movie._id)
          .then((data) => res.send(data));
      } else {
        return Promise.reject(new NoAccessError('Вы не можете удалить этот фильм'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidDataError('Передан невалидный ID'));
      } else { next(err); }
    });
};
