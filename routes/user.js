const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.get('/signup',userController.getSignUp);
router.post('/signup',userController.postSignUp);
router.get('/login',userController.getlogin);
router.post('/login',userController.postLogin);

module.exports = router;