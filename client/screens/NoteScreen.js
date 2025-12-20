import React, { useState, useEffect } from 'react';
import {
    View, Text, Button, FlatList, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert, ActivityIndicator
} from 'react-native';
import axios from '../services/axios';  // Import Axios configuration
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFontSize } from '../context/fontSizeContext';

const NotesScreen = () => {
    const [notes, setNotes] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');

    const { fontSize } = useFontSize(); // GET FONT SIZE FROM CONTEXT


    useEffect(() => {
        loadUserAndFetchNotes();
    }, []);

    const loadUserAndFetchNotes = async () => {
        try {
            const storedUserId = await AsyncStorage.getItem('userId');
            const storedUsername = await AsyncStorage.getItem('username');

            console.log('Stored User ID:', storedUserId);
            console.log('Stored Username:', storedUsername);

            if (storedUserId) {
                setUserId(storedUserId);
                setUsername(storedUsername || 'User');
                fetchNotes(storedUserId);
            } else {
                Alert.alert('Error', 'User not logged in');
            }
        } catch (error) {
            console.error('Error loading user:', error);
        }
    };

    const fetchNotes = async (id) => {
        try {
            setLoading(true);
            console.log('Fetching notes for user:', id);
            const response = await axios.get(`http://10.0.2.2:3000/notes?user_id=${id}`); // Changed: Use baseURL from axios config
            console.log('Notes fetched:', response.data);
            setNotes(response.data.notes);
        } catch (error) {
            console.error('Error fetching notes:', error);
            Alert.alert('Error', 'Failed to load notes');
        } finally {
            setLoading(false);
        }
    };
    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

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
            setNotes([response.data.note, ...notes]);
            setNewTitle('');
            setNewContent('');
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
        setExpandedId(null);
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingId(null);
        setEditTitle('');
        setEditContent('');
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
            });

            console.log('Note updated:', response.data);

            // Update the note in the list
            setNotes(
                notes.map((note) =>
                    note.id === id ? response.data.note : note
                )
            );

            setEditingId(null);
            setEditTitle('');
            setEditContent('');
            Alert.alert('Success', 'Note updated successfully!');
        } catch (error) {
            console.error('Error updating note:', error);
            Alert.alert('Error', error.response?.data?.Message || 'Failed to update note');
        }
    };

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

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

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
                <Text style={styles.headerTitle}>  {username
                    ? `${username.charAt(0).toUpperCase() + username.slice(1)}'s Notes`
                    : 'My Notes'
                }</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowAddForm(!showAddForm)}
                >
                    <Text style={styles.addButtonText}>{showAddForm ? '✕' : '+'}</Text>
                </TouchableOpacity>
            </View>

            {/* Add Note Form */}
            {showAddForm && (
                <View style={styles.addForm}>
                    <TextInput
                        style={styles.input}
                        placeholder="Note Title"
                        value={newTitle}
                        onChangeText={setNewTitle}
                        autoCapitalize="sentences"
                    />
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
                    <TouchableOpacity style={styles.saveButton} onPress={handleAddNote}>
                        <Text style={styles.saveButtonText}>Save Note</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Notes List */}
            <ScrollView style={styles.notesList}>
                {notes.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No notes yet. Tap + to add one!</Text>
                    </View>
                ) : (
                    notes.map((note) => (
                        <View key={note.id} style={styles.noteCard}>
                            {editingId === note.id ? (
                                <View style={styles.editForm}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Note Title"
                                        value={editTitle}
                                        onChangeText={setEditTitle}
                                        autoCapitalize="sentences"
                                    />
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
                                    <TouchableOpacity
                                        style={styles.noteHeader}
                                        onPress={() => toggleExpand(note.id)}
                                    >
                                        <View style={styles.noteTitleContainer}>
                                            <Text style={[styles.noteTitle, fontSize === 'big' ? styles.bigText : styles.smallText]}>{note.title}</Text>
                                            <Text style={[styles.noteDate, fontSize === 'big' ? styles.bigNoteDate : styles.smallNoteDate]}>
                                                {formatDate(note.created_at)}
                                            </Text>
                                        </View>
                                        <Text style={styles.expandIcon}>
                                            {expandedId === note.id ? '▼' : '▶'}
                                        </Text>
                                    </TouchableOpacity>

                                    {expandedId === note.id && (
                                        <View style={styles.noteContent}>
                                            <Text style={[styles.contentText, fontSize === 'big' ? styles.bigContentText : styles.smallContentText] }>{note.content}</Text>
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
    smallNoteDate:{
        fontSize: 12
    },
    bigNoteDate:{
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
});