const express = require('express');
const router = express.Router();
const { getNotes, addNewNote, updateNote, deleteNote } = require('../controllers/noteController');  // Importing controller functions

// Route to get all notes for a user
router.get('/', getNotes);

// Route to create a new note
router.post('/', addNewNote);

// Route to update a note by ID
router.put('/:id', updateNote);

// Route to delete a note by ID
router.delete('/:id', deleteNote);

module.exports = router;