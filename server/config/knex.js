// Load environment variables from a .env file
// The path is specified to ensure it loads variables from the config/.env file
require('dotenv').config({ path: './config/.env' });
// Import the knex module, a SQL query builder for Node.js
const knex = require('knex');
// Output the DB_PASSWORD environment variable to the console for debugging purposes
// This is useful to verify if the environment variable is being loaded correctly
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);

// Initialize a Knex instance for connecting to a MySQL database
const db = knex({
  client: 'mysql2', // Use the 'mysql2' client for database interactions
  connection: {
    // Define the host of the MySQL server. Default is '127.0.0.1' (localhost).
    // It can be overridden by the DB_HOST environment variable
    host: process.env.DB_HOST || '127.0.0.1',
    // Define the username to connect to the MySQL database.
    // Default is 'root', but can be overridden by the DB_USER environment variable
    port: process.env.DB_PORT || 3306,
    // Define the username to connect to the MySQL database.
    // Default is 'root', but can be overridden by the DB_USER environment variable
    user: process.env.DB_USER || 'root',
    // Define the password for the MySQL database user.
    // The password is taken from the DB_PASSWORD environment variable.
    password: process.env.DB_PASSWORD,
    // Define the name of the database to connect to.
    // Default is 'note_taking_app', but can be overridden by the DB_NAME environment variable
    database: process.env.DB_NAME || 'note_taking_app',
  },
  // Configuration for database connection pooling
  pool: {
    min: 0, // Minimum number of connections in the pool
    max: 7, // Maximum number of connections in the pool
  },
});

// Export the Knex instance to be used by other parts of the application for interacting with the database
module.exports = db;
