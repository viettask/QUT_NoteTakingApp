const { getNotesByUserId, addNote, updateNote, deleteNote } = require('../models/noteModel'); // Importing note model functions

// Get all notes for a user
const getNotes = async (req, res) => {
  const userId = req.userId; // Assuming you have JWT-based authentication and user ID is stored in req.userId

  try {
    // Fetch the notes for the logged-in user from the database
    const notes = await getNotesByUserId(userId);
    res.status(200).json(notes);  // Send the notes as a JSON response
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes', error: error.message });
  }
};

// Add a new note
const addNewNote = async (req, res) => {
  const userId = req.userId;
  const { title, content } = req.body;

  try {
    // Insert a new note into the database
    const newNote = await addNote(userId, title, content);

    // Send the newly created note back as a response
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: 'Error adding note', error: error.message });
  }
};

// Update an existing note
const updateExistingNote = async (req, res) => {
  const userId = req.userId;
  const noteId = req.params.id;  // Get the note ID from the URL
  const { title, content } = req.body;

  try {
    // Update the note in the database
    const updatedNote = await updateNote(noteId, userId, title, content);

    // Check if the note was updated
    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found or unauthorized' });
    }

    res.status(200).json(updatedNote);  // Send back the updated note
  } catch (error) {
    res.status(500).json({ message: 'Error updating note', error: error.message });
  }
};

// Delete a note
const deleteExistingNote = async (req, res) => {
  const userId = req.userId;
  const noteId = req.params.id;  // Get the note ID from the URL

  try {
    // Delete the note from the database
    const result = await deleteNote(noteId, userId);

    // Check if the note was deleted
    if (!result) {
      return res.status(404).json({ message: 'Note not found or unauthorized' });
    }

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note', error: error.message });
  }
};

module.exports = { getNotes, addNewNote, updateExistingNote, deleteExistingNote };