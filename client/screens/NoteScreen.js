// import necessary modules and components
import React, { useState, useEffect } from 'react';
import {
    View, Text, Button, FlatList, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert, ActivityIndicator
} from 'react-native';
// Import Axios configuration
import axios from '../services/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Import custom font size context
import { useFontSize } from '../context/fontSizeContext';

// NotesScreen Component
const NotesScreen = () => {
    // Store notes data
    const [notes, setNotes] = useState([]);
    // Track expanded note (for toggling content visibility)
    const [expandedId, setExpandedId] = useState(null);
    // Control loading state
    const [loading, setLoading] = useState(true);
    // Toggling visibility of Add Note form
    const [showAddForm, setShowAddForm] = useState(false);
    // Stores new note title and content
    const [newTitle, setNewTitle] = useState('');
    // Stores new note content
    const [newContent, setNewContent] = useState('');
    // Stores the logged-in user's ID and username
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState('');
    // Tracks which note is being edited
    const [editingId, setEditingId] = useState(null);
    // Stores edited note details
    const [editTitle, setEditTitle] = useState('');
    // Stores the content of the note being edited
    const [editContent, setEditContent] = useState('');
    // Stores the category ID of the note being edited
    const [editCategoryId, setEditCategoryId] = useState(null);
    // Stores the list of categories
    const [categories, setCategories] = useState([]);


    // Get the font size setting from context
    const { fontSize } = useFontSize();

    // Fetch notes when component mounts
    useEffect(() => {
        loadUserAndFetchNotes();
    }, []);

    //Load user data from AsyncStorage and fetch notes for that user
    const loadUserAndFetchNotes = async () => {
        try {
            const storedUserId = await AsyncStorage.getItem('userId');
            const storedUsername = await AsyncStorage.getItem('username');

            console.log('Stored User ID:', storedUserId);
            console.log('Stored Username:', storedUsername);

            if (storedUserId) {
                setUserId(storedUserId);
                setUsername(storedUsername || 'User');
                await fetchCategories();
                fetchNotes(storedUserId);
            } else {
                Alert.alert('Error', 'User not logged in');
            }
        } catch (error) {
            console.error('Error loading user:', error);
        }
    };

    // Fetch categories from the backend
    const fetchCategories = async () => {
        try {
            const response = await axios.get(`http://10.0.2.2:3000/notes/categories`);
            console.log('Categories fetched:', response.data);
            setCategories(response.data.categories || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            Alert.alert('Error', 'Failed to load categories');
        }
        finally {
            setLoading(false);
        }
    };

    // Fetch notes for the given user ID
    const fetchNotes = async (id) => {
        try {
            setLoading(true);
            console.log('Fetching notes for user:', id);
            const response = await axios.get(`http://10.0.2.2:3000/notes?user_id=${id}`); // Changed: Use baseURL from axios config
            console.log('Notes fetched:', response.data);
            // Set the fetched notes into state
            setNotes(response.data.notes);
        } catch (error) {
            console.error('Error fetching notes:', error);
            Alert.alert('Error', 'Failed to load notes');
        } finally {
            // set loading to false after fetch attempt
            setLoading(false);
        }
    };

    // Toggle note expansion to show/hide content
    const toggleExpand = (id) => {
        // If the clicked note is already expanded, collapse it; otherwise, expand it
        setExpandedId(expandedId === id ? null : id);
    };

    // Add a new note
    const handleAddNote = async () => {
        if (!newTitle.trim() || !newContent.trim()) {
            Alert.alert('Error', 'Please fill in both title and content');
            return;
        }

        try {
            const response = await axios.post('http://10.0.2.2:3000/notes', {
                title: newTitle.trim(),
                content: newContent.trim(),
                user_id: userId,
            });

            console.log('Note added:', response.data);
            // Add the new note at the beginning of the notes list
            setNotes([response.data.note, ...notes]);
            // Reset title input and content input
            setNewTitle('');
            setNewContent('');
            // Hide the add note form
            setShowAddForm(false);
            Alert.alert('Success', 'Note added successfully!');
        } catch (error) {
            console.error('Error adding note:', error);
            Alert.alert('Error', 'Failed to add note');
        }
    };

    // Start editing a note
    const handleStartEdit = (note) => {
        setEditingId(note.id);
        setEditTitle(note.title);
        setEditContent(note.content);
        setEditCategoryId(note.category_id || null);
        // Collapse the note content view if it's being edited
        setExpandedId(null);
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingId(null);
        setEditTitle('');
        setEditContent('');
        setEditCategoryId(null);
    };

    // Save edited note
    const handleUpdateNote = async (id) => {
        if (!editTitle.trim() || !editContent.trim()) {
            Alert.alert('Error', 'Please fill in both title and content');
            return;
        }

        try {
            const response = await axios.put(`http://10.0.2.2:3000/notes/${id}`, {
                title: editTitle.trim(),
                content: editContent.trim(),
                category_id: editCategoryId,
            });

            console.log('Note updated:', response.data);

            // Update the note in the list
            setNotes(
                notes.map((note) =>
                    note.id === id ? response.data.note : note
                )
            );
            // Reset editing state
            setEditingId(null);
            setEditTitle('');
            setEditContent('');
            setEditCategoryId(null);
            Alert.alert('Success', 'Note updated successfully!');
        } catch (error) {
            console.error('Error updating note:', error);
            Alert.alert('Error', error.response?.data?.Message || 'Failed to update note');
        }
    };

    // Delete a note
    const handleDeleteNote = async (id) => {
        Alert.alert(
            'Delete Note',
            'Are you sure you want to delete this note?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await axios.delete(`http://10.0.2.2:3000/notes/${id}`);
                            // Remove the deleted note from the list
                            setNotes(notes.filter(note => note.id !== id));
                            Alert.alert('Success', 'Note deleted successfully!');
                        } catch (error) {
                            console.error('Error deleting note:', error);
                            Alert.alert('Error', 'Failed to delete note');
                        }
                    },
                },
            ]
        );
    };

    // Format date to a readable string
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // If data is still loading, show a loading spinner
    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading notes...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                {/* Display user's name or default 'My Notes' */}
                <Text style={styles.headerTitle}>  {username
                    ? `${username.charAt(0).toUpperCase() + username.slice(1)}'s Notes`
                    : 'My Notes'
                }</Text>
                {/* Button to toggle the note add form */}
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowAddForm(!showAddForm)} // Toggling form visibility
                >
                    <Text style={styles.addButtonText}>{showAddForm ? '✕' : '+'}</Text>
                </TouchableOpacity>
            </View>

            {/* Add Note Form */}
            {showAddForm && (
                <View style={styles.addForm}>
                    /* Input for note title */}
                    <TextInput
                        style={styles.input}
                        placeholder="Note Title"
                        value={newTitle}
                        onChangeText={setNewTitle}
                        autoCapitalize="sentences"
                    />
                    {/* Input for note content (multi-line) */}
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Note Content"
                        value={newContent}
                        onChangeText={setNewContent}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        autoCapitalize="sentences"
                    />
                    {/* Button to save the new note */}
                    <TouchableOpacity style={styles.saveButton} onPress={handleAddNote}>
                        <Text style={styles.saveButtonText}>Save Note</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Notes List */}
            <ScrollView style={styles.notesList}>
                {notes.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        {/* Message when there are no notes */}
                        <Text style={styles.emptyText}>No notes yet. Tap + to add one!</Text>
                    </View>
                ) : (
                    notes.map((note) => (
                        <View key={note.id} style={[styles.noteCard, { backgroundColor: note.category_color || '#fff' }]}>
                            {/* If editing, show edit form */}
                            {editingId === note.id ? (
                                <View style={styles.editForm}>
                                    {/* Edit note title */}
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Note Title"
                                        value={editTitle}
                                        onChangeText={setEditTitle}
                                        autoCapitalize="sentences"
                                    />
                                    {/* Category Selector for Edit */}
                                    <View style={styles.categorySelector}>
                                        <Text style={styles.categorySelectorLabel}>Category:</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScrollView}>
                                            {/* List of categories for selection */}
                                            {categories.map((cat) => (
                                                <TouchableOpacity
                                                    key={cat.id}
                                                    style={[
                                                        styles.categoryChip,
                                                        { backgroundColor: cat.color },
                                                        editCategoryId === cat.id && styles.categoryChipSelected
                                                    ]}
                                                    onPress={() => setEditCategoryId(cat.id)}
                                                >
                                                    <Text style={styles.categoryChipText}>
                                                        {cat.name}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>
                                    {/* Edit note content */}
                                    <TextInput
                                        style={[styles.input, styles.textArea]}
                                        placeholder="Note Content"
                                        value={editContent}
                                        onChangeText={setEditContent}
                                        multiline
                                        numberOfLines={4}
                                        textAlignVertical="top"
                                        autoCapitalize="sentences"
                                    />
                                    {/* Buttons to cancel or save the update */}
                                    <View style={styles.editButtons}>
                                        <TouchableOpacity
                                            style={[styles.editActionButton, styles.cancelButton]}
                                            onPress={handleCancelEdit}
                                        >
                                            <Text style={styles.editActionButtonText}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.editActionButton, styles.updateButton]}
                                            onPress={() => handleUpdateNote(note.id)}
                                        >
                                            <Text style={styles.editActionButtonText}>Update</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : (
                                <>
                                    {/* Note header with title and date */}
                                    <TouchableOpacity
                                        style={styles.noteHeader}
                                        onPress={() => toggleExpand(note.id)}
                                    >
                                        <View style={styles.noteTitleContainer}>
                                            {/* <Text style={[styles.noteTitle, fontSize === 'big' ? styles.bigText : styles.smallText]}>{note.title}</Text> */}

                                            <View style={styles.titleRow}>
                                                <Text style={[styles.noteTitle, fontSize === 'big' ? styles.bigText : styles.smallText]}>
                                                    {note.title}
                                                </Text>
                                                {note.category_name && (
                                                    <View style={styles.categoryBadge}>
                                                        <Text style={styles.categoryBadgeText}>
                                                            {note.category_name}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                            <Text style={[styles.noteDate, fontSize === 'big' ? styles.bigNoteDate : styles.smallNoteDate]}>
                                                {formatDate(note.created_at)}
                                            </Text>
                                        </View>
                                        <Text style={styles.expandIcon}>
                                            {expandedId === note.id ? '▼' : '▶'}
                                        </Text>
                                    </TouchableOpacity>

                                    {/* Expanded content section */}
                                    {expandedId === note.id && (
                                        <View style={styles.noteContent}>
                                            <Text style={[styles.contentText, fontSize === 'big' ? styles.bigContentText : styles.smallContentText]}>{note.content}</Text>
                                            {/* Action buttons: Edit and Delete */}
                                            <View style={styles.actionButtons}>
                                                <TouchableOpacity
                                                    style={[styles.actionButton, styles.editButton]}
                                                    onPress={() => handleStartEdit(note)}
                                                >

                                                    <Text style={styles.actionButtonText}>Edit</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={[styles.actionButton, styles.deleteButton]}
                                                    onPress={() => handleDeleteNote(note.id)}
                                                >
                                                    <Text style={styles.actionButtonText}>Delete</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )}
                                </>
                            )}
                        </View>
                    ))
                )}
            </ScrollView>

        </View>
    );
};

export default NotesScreen;

// Styles for the NotesScreen components
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#007AFF',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 24,
        color: '#007AFF',
        fontWeight: 'bold',
    },
    addForm: {
        backgroundColor: '#fff',
        padding: 20,
        margin: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    saveButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 6,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    notesList: {
        flex: 1,
        padding: 15,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },
    noteCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    noteHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    noteTitleContainer: {
        flex: 1,
    },
    noteTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    noteDate: {
        fontSize: 12,
        color: '#999',
    },
    smallNoteDate: {
        fontSize: 12
    },
    bigNoteDate: {
        fontSize: 14
    }
    ,
    expandIcon: {
        fontSize: 16,
        color: '#007AFF',
        marginLeft: 10,
    },
    noteContent: {
        padding: 15,
        paddingTop: 0,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    contentText: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
        marginBottom: 10,
        marginTop: 10,
    },
    smallContentText: {
        fontSize: 16,
    },
    bigContentText: {
        fontSize: 20,
    }
    ,
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },
    actionButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 6,
    },
    editButton: {
        backgroundColor: '#007AFF',
    },
    deleteButton: {
        backgroundColor: '#ff3b30',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    editForm: {
        padding: 15,
    },
    editButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
        marginTop: 10,
    },
    editActionButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 6,
    },
    cancelButton: {
        backgroundColor: '#ff3b30',
    },
    updateButton: {
        backgroundColor: '#007AFF',
    },
    editActionButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    smallText: {
        fontSize: 16, // Default small font size
    },
    bigText: {
        fontSize: 20, // Larger font size
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        flexWrap: 'wrap',
    },
    categoryBadge: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 8,
    },
    categoryBadgeText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    smallCategoryBadgeText: {
        fontSize: 13,
    },
    bigCategoryBadgeText: {
        fontSize: 15,
    },
    categorySelector: {
        marginBottom: 15,
    },
    categorySelectorLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    categoryScrollView: {
        flexDirection: 'row',
    },
    categoryChip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 16,
        marginRight: 8,
        opacity: 0.7,
    },
    categoryChipSelected: {
        opacity: 1,
        borderWidth: 3,
        borderColor: '#000',
    },
    categoryChipText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
});