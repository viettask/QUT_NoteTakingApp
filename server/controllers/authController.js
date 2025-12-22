// import necessary modules
const knex = require('../config/knex'); // Import the Knex instance for database interaction
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken');

/* POST register new user */
const register = async (req, res, next) => {
  const { username, password } = req.body; // Destructure username and password from request body

  console.log("Received:", { username, password }); // Log received data for debugging

  // Validation to ensure both username and password are provided
  if (!username || !password) {
    return res.status(400).json({
      Error: true,
      Message: "Username and password are required"
    });
  }

  try {

    console.log("Checking if user exists...");

    // Check if user already exists in the database by querying the users table
    const existingUser = await req.db
      .from("users")
      .select("*")
      .where("username", "=", username) // Match by username
      .first(); // Retrieve the first matching record

    console.log("Existing user:", existingUser); // Log existing user for debugging

    if (existingUser) {
      // If user exists, return a 409 Conflict response
      return res.status(409).json({
        Error: true,
        Message: "Username already exists"
      });
    }

    console.log("Hashing password...");

    // Hash password using bcrypt before storing it in the database
    const saltRounds = 10; // saltRounds defines the complexity of the hashing
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log("Inserting user...");
    // Insert new user into the "users" table with hashed password
    const [userId] = await req.db("users").insert({
      username: username, // Store the username
      password: hashedPassword // Store the hashed password
    });

    console.log("User created with ID:", userId);  // Log the new user's ID for debugging

    // Respond with success message and the new user's ID
    res.status(201).json({
      Error: false,
      Message: "User registered successfully",
      UserId: userId
    });

  } catch (err) {
    // Log any errors that occur during the process
    console.log("ERROR DETAILS:", err);
    // Respond with a 500 Internal Server Error if mySQL query fails
    res.status(500).json({
      Error: true,
      Message: "Error in MySQL query"
    });
  }
};

/* POST login user */
const login = async (req, res, next) => {
  const { username, password } = req.body; //Extract username and password from request body

  console.log("Login attempt:", { username, password }); // Log login attempt for debugging

  // Validation to check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({
      Error: true,
      Message: "Username and password are required"
    });
  }

  try {
    // Find the user by username from the database
    const user = await req.db
      .from("users")
      .select("*")
      .where("username", "=", username) // Match by username
      .first(); // Retrieve the first matching record

    console.log("User found:", user); // Log found user for debugging

    // If user not found, return 401 Unauthorized
    if (!user) {
      return res.status(401).json({
        Error: true,
        Message: "Invalid username or password"
      });
    }

    // Compare the provided password with the stored hashed password
    const match = await bcrypt.compare(password, user.password);

    // If passwords do not match, return 401 Unauthorized
    if (!match) {
      return res.status(401).json({
        Error: true,
        Message: "Invalid username or password"
      });
    }

    // If login is successful, return user details (don't send password back)
    res.json({
      Error: false,
      Message: "Login successful",
      User: {
        id: user.id, // Return user ID
        username: user.username // Return username
      }
    });

  } catch (err) {
    console.log(err); // Log any errors that occur during the process
    // Respond with a 500 Internal Server Error if mySQL query fails
    res.status(500).json({
      Error: true,
      Message: "Error in MySQL query"
    });
  }
};

/* PUT update username */
const updateUsername = async (req, res) => {
  // Get user ID from request parameters
  const { id } = req.params;
  console.log("Updating user ID:", id);  // Check if user ID is correct for debugging

  // Get new username from request body
  const { username } = req.body;
  console.log("New username:", username);  // Ensure username is passed properly

  // Validation to check if username is provided
  if (!username) {
    return res.status(400).json({
      Error: true,
      Message: 'Username is required'
    });
  }

  try {
    // Check if username already exists in the database, excluding the current user
    const existingUser = await req.db('users')
      .where('username', username)
      .whereNot('id', id) // exclude current user
      .first();

    console.log("Existing user:", existingUser); // Log existing user for debugging

    // If username is taken, return 409 Conflict
    if (existingUser) {
      return res.status(409).json({
        Error: true,
        Message: 'Username already taken'
      });
    }

    // Update username in the database for the given user ID
    await req.db('users')
      .where('id', id)
      .update({ username: username });

    // Return a success response after updating username
    res.json({
      Error: false,
      Message: 'Username updated successfully'
    });
  } catch (error) {
    console.error('Error updating username:', error.Message); // Log error details for debugging
    // Return a 500 Internal Server Error if update fails
    res.status(500).json({
      Error: true,
      Message: 'Failed to update username',
      Details: error.message
    });
  }
};

/* PUT update password */
const updatePassword = async (req, res) => {
  const { id } = req.params; // Get user ID from request parameters
  const { currentPassword, newPassword } = req.body; //Extract current and new passwords from request body

  // Validation to check if both current and new passwords are provided
  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      Error: true,
      Message: 'Current password and new password are required'
    });
  }

  try {
    // Get the user by ID from the database
    const user = await req.db('users')
      .where('id', id)
      .first();
    // If user not found, return 404 Not Found
    if (!user) {
      return res.status(404).json({
        Error: true,
        Message: 'User not found'
      });
    }

    // Verify current password by comparing it with the stored hashed password
    const match = await bcrypt.compare(currentPassword, user.password);

    // If current password does not match, return 401 Unauthorized
    if (!match) {
      return res.status(401).json({
        Error: true,
        Message: 'Current password is incorrect'
      });
    }

    // Hash new password before storing it in the database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password in the database for the given user ID
    await req.db('users')
      .where('id', id)
      .update({ password: hashedPassword });
    // Return a success response after updating password
    res.json({
      Error: false,
      Message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error updating password:', error); // Log error details for debugging
    // Return a 500 Internal Server Error if update fails
    res.status(500).json({
      Error: true,
      Message: 'Failed to update password'
    });
  }
};

// Export the functions to be used in other parts of the application
module.exports = { register, login, updateUsername, updatePassword };