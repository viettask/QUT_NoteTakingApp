const { registerUser, getUserByUsername } = require('../models/userModel'); // Importing the user model for database interactions
const bcrypt = require('bcryptjs');  // To hash passwords
const jwt = require('jsonwebtoken');  // For creating JSON Web Tokens (JWT)

// Register a new user
const register = async (req, res) => {
  const { username, password } = req.body;

  // Check if username is already taken
  try {
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Register the new user (save to database)
    const newUser = await registerUser(username, hashedPassword);

    // Send a response back to the client
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: newUser.id, username: newUser.username }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login a user
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token for the authenticated user
    const token = jwt.sign(
      { userId: user.id },  // Payload (user ID)
      process.env.JWT_SECRET,  // Secret key from .env
      { expiresIn: '1h' }  // Token expiration time
    );

    // Send the token back to the client
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

module.exports = { register, login };