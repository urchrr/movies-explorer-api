const router = require('express').Router();
const express = require('express');
const { postMovieValidation, idMovieValidation } = require('../middlewares/validation');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', express.json(), postMovieValidation(), createMovie);
router.delete('/:_id', idMovieValidation(), deleteMovie);

module.exports = router;
