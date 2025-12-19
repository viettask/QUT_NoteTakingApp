const knex = require('../config/knex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/* POST register new user */
const register =  async (req, res, next) => {
  const { username, password } = req.body;

  console.log("Received:", { username, password }); 

  // Validation
  if (!username || !password) {
    return res.status(400).json({ 
      Error: true, 
      Message: "Username and password are required" 
    });
  }

  try {

    console.log("Checking if user exists..."); 

    // Check if user already exists
    const existingUser = await req.db
      .from("users")
      .select("*")
      .where("username", "=", username)
      .first();

    console.log("Existing user:", existingUser); 

    if (existingUser) {
      return res.status(409).json({ 
        Error: true, 
        Message: "Username already exists" 
      });
    }

    console.log("Hashing password..."); 

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log("Inserting user..."); 
    // Insert new user
    const [userId] = await req.db("users").insert({
      username: username,
      password: hashedPassword
    });

    console.log("User created with ID:", userId); 

    res.status(201).json({ 
      Error: false, 
      Message: "User registered successfully",
      UserId: userId
    });

  } catch (err) {
    console.log("ERROR DETAILS:", err); 
    res.status(500).json({ 
      Error: true, 
      Message: "Error in MySQL query" 
    });
  }
};

/* POST login user */
const login =  async  (req, res, next) => {
  const { username, password } = req.body;

  // Validation
  if (!username || !password) {
    return res.status(400).json({ 
      Error: true, 
      Message: "Username and password are required" 
    });
  }

  try {
    // Find user
    const user = await req.db
      .from("users")
      .select("*")
      .where("username", "=", username)
      .first();

    if (!user) {
      return res.status(401).json({ 
        Error: true, 
        Message: "Invalid username or password" 
      });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ 
        Error: true, 
        Message: "Invalid username or password" 
      });
    }

    // Success - don't send password back
    res.json({ 
      Error: false, 
      Message: "Login successful",
      User: {
        id: user.id,
        username: user.username
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ 
      Error: true, 
      Message: "Error in MySQL query" 
    });
  }
};

/* PUT update username */
const updateUsername = async (req, res) => {
  const { id } = req.params;
  console.log("Updating user ID:", id);  // Check if ID is correct
  const { username } = req.body;
  console.log("New username:", username);  // Ensure username is passed properly


  if (!username) {
    return res.status(400).json({
      Error: true,
      Message: 'Username is required'
    });
  }

  try {
    // Check if username already exists
    const existingUser = await req.db('users')
      .where('username', username)
      .whereNot('id', id)
      .first();

    console.log("Existing user:", existingUser);


    if (existingUser) {
      return res.status(409).json({
        Error: true,
        Message: 'Username already taken'
      });
    }

    // Update username
    await req.db('users')
      .where('id', id)
      .update({ username: username });

    res.json({
      Error: false,
      Message: 'Username updated successfully'
    });
  } catch (error) {
    console.error('Error updating username:', error.Message);
    res.status(500).json({
      Error: true,
      Message: 'Failed to update username',
      Details: error.message
    });
  }
};

/* PUT update password */
const updatePassword = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      Error: true,
      Message: 'Current password and new password are required'
    });
  }

  try {
    // Get user
    const user = await req.db('users')
      .where('id', id)
      .first();

    if (!user) {
      return res.status(404).json({
        Error: true,
        Message: 'User not found'
      });
    }

    // Verify current password
    const match = await bcrypt.compare(currentPassword, user.password);

    if (!match) {
      return res.status(401).json({
        Error: true,
        Message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await req.db('users')
      .where('id', id)
      .update({ password: hashedPassword });

    res.json({
      Error: false,
      Message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({
      Error: true,
      Message: 'Failed to update password'
    });
  }
};


module.exports = { register, login , updateUsername , updatePassword};