// Import necessary modules
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { register, login, updateUsername, updatePassword } = require('../controllers/authController');  // Importing controller functions

// Define routes and associate them with controller functions

/* POST register new user */
// Route for registering a new user, calls the 'register' function from 'authController'
router.post("/register", register);

/* POST login user */
// Route for logging in a user, calls the 'login' function from 'authController'
router.post("/login", login);

/* PUT update username */
// Route to update a user's username by their ID, calls 'updateUsername' function from 'authController'
router.put('/update-username/:id', updateUsername);

/* PUT update password */
// Route to update a user's password by their ID, calls 'updatePassword' function from 'authController'
router.put('/update-password/:id', updatePassword);

// Export the router so it can be used in other parts of the application (e.g., in the app.js file)
module.exports = router;