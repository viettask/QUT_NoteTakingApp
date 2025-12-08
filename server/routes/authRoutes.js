const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');  // Importing controller functions

// Route to register a user
router.post('/register', register);

// Route to login a user
router.post('/login', login);

module.exports = router;