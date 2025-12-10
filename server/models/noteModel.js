const knex = require('../config/knexfile');

// Get notes for a specific user
const getNotesByUserId = async (userId) => {
  try {
    const notes = await knex('notes').where({ user_id: userId });
    return notes;
  } catch (error) {
    throw new Error('Error fetching notes: ' + error.message);
  }
};

// Add a new note for a user
const addNote = async (userId, title, content) => {
  try {
    const [newNote] = await knex('notes').insert({ user_id: userId, title, content }).returning('*');
    return newNote;
  } catch (error) {
    throw new Error('Error adding note: ' + error.message);
  }
};

module.exports = { getNotesByUserId, addNote };