const knex = require('../config/knex');

// Get all categories
const getCategories = async (req, res) => {
    console.log("Categories route hit");  // Log to verify the route is called
    try {
        const categories = await req.db('categories')
            .select('id', 'name', 'color', 'description')
            .orderBy('name', 'asc');

        res.json({
            Error: false,
            Message: 'Success',
            categories: categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            Error: true,
            Message: 'Error fetching categories'
        });
    }
};

// Get all notes for a user
const getNotes = async (req, res) => {
    const userId = req.query.user_id;

    try {
        let query = req.db.from('notes as n').leftJoin('categories as c', 'n.category_id', 'c.id').select('n.*', 'c.name as category_name','c.color as category_color').orderBy('n.created_at', 'desc');

        // Filter by user if provided
        if (userId) {
            query = query.where('user_id', userId);
        }

        const notes = await query;
        console.log('Notes found:', notes.length);
        // Even if empty, return success with empty array
        res.json({
            Error: false,
            Message: 'Success',
            notes: notes  // Will be [] if no notes found
        });
    } catch (err) {
        console.error('Error fetching notes:', err);
        res.status(500).json({
            Error: true,
            Message: 'Error fetching notes'
        });
    }
};

// Add a new note
const addNewNote = async (req, res) => {
    const { title, content, user_id } = req.body;

    if (!title || !content) {
        return res.status(400).json({
            Error: true,
            Message: 'Title and content are required'
        });
    }

    try {
        const [noteId] = await req.db('notes').insert({
            title: title,
            content: content,
            user_id: user_id,
            created_at: new Date(),
            updated_at: new Date()
        });

        // Get the newly created note
        const newNote = await req.db('notes')
            .where('id', noteId)
            .first();

        res.status(201).json({
            Error: false,
            Message: 'Note created successfully',
            note: newNote
        });
    } catch (err) {
        console.error('Error creating note:', err);
        res.status(500).json({
            Error: true,
            Message: 'Failed to create note'
        });
    }
};




// Update an existing note
const updateNote = async (req, res) => {
    const { id } = req.params;
    const { title, content, category_id} = req.body;

    // Validation
    if (!title || !content) {
        return res.status(400).json({
            Error: true,
            Message: 'Title and content are required'
        });
    }

    try {
        // Check if note exists
        const note = await req.db('notes')
            .where('id', id)
            .first();

        if (!note) {
            return res.status(404).json({
                Error: true,
                Message: 'Note not found'
            });
        }

        // Update the note
        await req.db('notes')
            .where('id', id)
            .update({
                title: title,
                content: content,
                category_id: category_id,
                updated_at: new Date()
            });

        // Get the updated note
        const updatedNote = await req.db('notes as n')
            .leftJoin('categories as c', 'n.category_id', 'c.id')
            .select('n.*', 'c.name as category_name', 'c.color as category_color')
            .where('n.id', id)
            .first();

        res.json({
            Error: false,
            Message: 'Note updated successfully',
            note: updatedNote
        });
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({
            Error: true,
            Message: 'Error updating note'
        });
    }
};

// Delete a note
const deleteNote = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if note exists
        const note = await req.db('notes')
            .where('id', id)
            .first();

        if (!note) {
            return res.status(404).json({
                Error: true,
                Message: 'Note not found'
            });
        }

        // Delete the note
        await req.db('notes')
            .where('id', id)
            .del();

        res.json({
            Error: false,
            Message: 'Note deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({
            Error: true,
            Message: 'Error deleting note'
        });
    }
};

module.exports = { getNotes, addNewNote, updateNote, deleteNote, getCategories};