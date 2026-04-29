// routes/auth.js
const express = require('express');
const router = express.Router();
const { showLogin, showSignup, signup, login, logout } = require('../controllers/authController');

router.get('/login', showLogin);
router.get('/signup', showSignup);
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);

module.exports = router;
