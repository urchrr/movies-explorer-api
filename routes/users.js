const router = require('express').Router();
const express = require('express');

const { patchUserValidation } = require('../middlewares/validation');

const { patchUser, getUserInfo } = require('../controllers/users');

router.get('/me', getUserInfo);
router.patch('/me', express.json(), patchUserValidation(), patchUser);

module.exports = router;
