const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { register, login } = require('../controllers/authController');  // Importing controller functions

/* POST register new user */
router.post("/register", async function (req, res, next) {
  const { username, password } = req.body;

  console.log("Received:", { username, password }); // Add this

  // Validation
  if (!username || !password) {
    return res.status(400).json({ 
      Error: true, 
      Message: "Username and password are required" 
    });
  }

  try {

    console.log("Checking if user exists..."); // Add this

    // Check if user already exists
    const existingUser = await req.db
      .from("users")
      .select("*")
      .where("username", "=", username)
      .first();

    console.log("Existing user:", existingUser); // Add this

    if (existingUser) {
      return res.status(409).json({ 
        Error: true, 
        Message: "Username already exists" 
      });
    }

    console.log("Hashing password..."); // Add this

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log("Inserting user..."); // Add this

    // Insert new user
    const [userId] = await req.db("users").insert({
      username: username,
      password: hashedPassword
    });

    console.log("User created with ID:", userId); // Add this

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
});

/* POST login user */
router.post("/login", async function (req, res, next) {
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
});

module.exports = router;