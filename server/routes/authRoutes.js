const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { register, login , updateUsername, updatePassword} = require('../controllers/authController');  // Importing controller functions

/* POST register new user */
router.post("/register", register);

/* POST login user */
router.post("/login", login);

/* PUT update username */
router.put('/update-username/:id', updateUsername);

/* PUT update password */
router.put('/update-password/:id', updatePassword);

module.exports = router;