const { celebrate, Joi } = require('celebrate');
const { valid } = require('joi');
const validator = require('validator');
const InvalidDataError = require('../errors/invalid-data');

const email = Joi.string()
  .required()
  .pattern(new RegExp('[/.+@.+..+/i]'));
const password = Joi.string()
  .required()
  .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'));

const name = Joi.string().required().min(2).max(100);
const country = Joi.string().required().min(2).max(100);
const director = Joi.string().required().min(2).max(100);
const duration = Joi.number().required().integer().min(2);
const validLink = Joi.string().required()
  .custom((value, helpers) => {
    const isValid = validator.isURL(value, { require_protocol: true });
    if (isValid) {
      return value;
    }
    throw new InvalidDataError('Невалидная ссылка');
  });
const year = Joi.string().required().length(4);
const description = Joi.string().required().min(2).max(5000);
const nameRU = Joi.string().required().min(2).max(100)
  .regex(/^[a-zA-ZА-ЯЁа-яё\s\d-–:\.,?«»`'&:!’\-—*]+$/);
const nameEN = Joi.string().required().min(2).max(100)
  .regex(/^[a-zA-Z\s\d-–:\.,?«»`'&:!’\-Х—*äöüßÄÖÜ]+$/);
const movieId = Joi.number().required().min(1);
const thumbnail = validLink;
const trailer = validLink;
const image = validLink;

module.exports.signUpValidation = () => celebrate({
  body: Joi.object().keys({
    name,
    email,
    password,
  }),
});

module.exports.signInValidation = () => celebrate({
  body: Joi.object().keys({
    email,
    password,
  }),
});

module.exports.patchUserValidation = () => celebrate({
  body: Joi.object().keys({
    name,
    email
  }),
});

module.exports.postMovieValidation = () => celebrate({
  body: Joi.object().keys({
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
  }),
});

module.exports.idMovieValidation = () => celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
});
