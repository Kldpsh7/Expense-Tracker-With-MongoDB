const express = require('express');
const router = express.Router();
const path = require('path');
const passwordController = require('../controllers/password');

router.get('/resetPassword',passwordController.getResetPassword);
router.post('/resetPassword',passwordController.postResetPassword);
router.get('/reset',passwordController.getResetPage);
router.post('/reset',passwordController.postResetPage);

module.exports = router;