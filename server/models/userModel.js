const knex = require('../config/knexfile');  // Import knex configuration

// Register a new user
const registerUser = async (username, password) => {
  try {
    const [user] = await knex('users').insert({ username, password }).returning('*');
    return user;
  } catch (error) {
    throw new Error('Error registering user: ' + error.message);
  }
};

// Get user by username
const getUserByUsername = async (username) => {
  try {
    const user = await knex('users').where({ username }).first();
    return user;
  } catch (error) {
    throw new Error('Error fetching user: ' + error.message);
  }
};

module.exports = { registerUser, getUserByUsername };