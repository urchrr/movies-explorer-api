const router = require('express').Router();
const express = require('express');
const NotFoundError = require('../errors/not-found');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const {
  signUpValidation,
  signInValidation,
} = require('../middlewares/validation');

// routes
router.post('/signin', express.json(), signInValidation(), login);
router.post('/signup', express.json(), signUpValidation(), createUser);

router.use('/users', auth, require('./users'));
router.use('/movies', auth, require('./movies'));

router.use('*', (req) => {
    console.log(req)
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});
//

module.exports = router;
