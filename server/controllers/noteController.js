// Import the Knex configuration to interact with the database
const knex = require('../config/knex');

// Get all categories from the database
const getCategories = async (req, res) => {
    console.log("Categories route hit");  // Log to verify the route is called
    try {
        // Query to fetch categories with selected columns, ordered by name
        const categories = await req.db('categories')
            .select('id', 'name', 'color', 'description') //Select specific columns
            .orderBy('name', 'asc'); // Sort categories by name in ascending order

        // Return the categories in the response as a JSON object
        res.json({
            Error: false,
            Message: 'Success',
            categories: categories // Return the list of categories
        });
    } catch (error) {
        // Log any errors that occur during the database query if the query fails
        console.error('Error fetching categories:', error);
        res.status(500).json({
            Error: true,
            Message: 'Error fetching categories'
        });
    }
};

// Get all notes for a specific user
const getNotes = async (req, res) => {
    const userId = req.query.user_id; //Extract user_id from query parameters

    try {
        // Start query to fetch notes along with associated category details using LEFT JOIN
        let query = req.db.from('notes as n').leftJoin('categories as c', 'n.category_id', 'c.id').select('n.*', 'c.name as category_name', 'c.color as category_color').orderBy('n.created_at', 'desc');

        // Filter by user if provided, filter notes by user_id if provided
        if (userId) {
            query = query.where('user_id', userId);
        }

        const notes = await query; // Execute the query to get notes
        console.log('Notes found:', notes.length); // Log the number of notes found
        // Even if empty, return success with empty array
        res.json({
            Error: false,
            Message: 'Success',
            notes: notes  // Will be [] if no notes found
        });
    } catch (err) {
        // Log any errors that occur during the database query if the query fails
        console.error('Error fetching notes:', err);
        res.status(500).json({
            Error: true,
            Message: 'Error fetching notes'
        });
    }
};

// Add a new note to the database
const addNewNote = async (req, res) => {
    const { title, content, user_id } = req.body; // Extract title, content, and user_id from request body

    // Validation that both title and content are provided
    if (!title || !content) {
        return res.status(400).json({
            Error: true,
            Message: 'Title and content are required'
        });
    }

    try {
        // Insert the new note into the "notes" table and get the inserted note's ID
        const [noteId] = await req.db('notes').insert({
            title: title,
            content: content,
            user_id: user_id, // Associate note with the user
            created_at: new Date(),
            updated_at: new Date()
        });

        // Get the newly created note in order to return it in the response
        const newNote = await req.db('notes')
            .where('id', noteId)
            .first();

        // return the newly created note in the response
        res.status(201).json({
            Error: false,
            Message: 'Note created successfully',
            note: newNote //Return the note details
        });
    } catch (err) {
        // Log any errors that occur during the insertion if the query fails
        console.error('Error creating note:', err);
        res.status(500).json({
            Error: true,
            Message: 'Failed to create note'
        });
    }
};


// Update an existing note
const updateNote = async (req, res) => {
    const { id } = req.params; // Extract note ID from request parameters
    const { title, content, category_id } = req.body; // Extract title, content, and category_id from request body

    // Validation that both title and content are provided
    if (!title || !content) {
        return res.status(400).json({
            Error: true,
            Message: 'Title and content are required'
        });
    }

    try {
        // Check if note exists in the database
        const note = await req.db('notes')
            .where('id', id) // Match the note by ID
            .first(); // Return the first matching record

        // If note not found, return 404 Not Found
        if (!note) {
            return res.status(404).json({
                Error: true,
                Message: 'Note not found'
            });
        }

        // Update the note with the new title, content, and category_id
        await req.db('notes')
            .where('id', id) // Match the note by ID
            .update({
                title: title,
                content: content,
                category_id: category_id, // update category if provided
                updated_at: new Date() // Set updated_at timestamp to current date/time
            });

        // Retrieve the updated note along with category details
        const updatedNote = await req.db('notes as n')
            .leftJoin('categories as c', 'n.category_id', 'c.id') // Join to get category details
            .select('n.*', 'c.name as category_name', 'c.color as category_color')
            .where('n.id', id) // Match the note by ID
            .first(); // Return the first matching record

        // Return the updated note in the response
        res.json({
            Error: false,
            Message: 'Note updated successfully',
            note: updatedNote // Return the updated note details
        });
    } catch (error) {
        // Log and handle any errors that occur during the update if the query fails
        console.error('Error updating note:', error);
        res.status(500).json({
            Error: true,
            Message: 'Error updating note'
        });
    }
};

// Delete a note
const deleteNote = async (req, res) => {
    const { id } = req.params; // Extract note ID from request parameters

    try {
        // Check if note exists in the database
        const note = await req.db('notes')
            .where('id', id) // Match the note by ID
            .first(); // Return the first matching record

        // If note not found, return 404 Not Found
        if (!note) {
            return res.status(404).json({
                Error: true,
                Message: 'Note not found'
            });
        }

        // Delete the note
        await req.db('notes')
            .where('id', id) // Match the note by ID
            .del(); // Delete the record

        //Return success response after deletion
        res.json({
            Error: false,
            Message: 'Note deleted successfully'
        });
    } catch (error) {
        // Log and handle any errors that occur during deletion if the query fails
        console.error('Error deleting note:', error);
        res.status(500).json({
            Error: true,
            Message: 'Error deleting note'
        });
    }
};
//Export all the functions to be used in other parts of the application
module.exports = { getNotes, addNewNote, updateNote, deleteNote, getCategories };