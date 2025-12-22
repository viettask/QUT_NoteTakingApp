// Import necessary modules
const express = require('express');
const router = express.Router();
const { getNotes, addNewNote, updateNote, deleteNote, getCategories } = require('../controllers/noteController');  // Importing controller functions


// Route to get all categories
// When a GET request is made to '/categories', call the 'getCategories' function to fetch categories
router.get('/categories', getCategories);

// Route to get all notes for a user
// When a GET request is made to '/', call the 'getNotes' function to fetch notes
router.get('/', getNotes);

// Route to create a new note
// When a POST request is made to '/', call the 'addNewNote' function to create a new note
router.post('/', addNewNote);

// Route to update a note by ID
// When a PUT request is made to '/:id', call the 'updateNote' function to update the note with the provided ID
router.put('/:id', updateNote);

// Route to delete a note by ID
// When a DELETE request is made to '/:id', call the 'deleteNote' function to delete the note with the provided ID
router.delete('/:id', deleteNote);

// Export the router so it can be used in other parts of the application (e.g., in the main app file)
module.exports = router;