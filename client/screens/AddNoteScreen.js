import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import axios from '../services/axios';  // Import Axios configuration

const AddNoteScreen = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleAddNote = async () => {
    try {
      const response = await axios.post('/notes', { title, content });
      console.log('New note added:', response.data);
      // Navigate back to the notes list or show a success message
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Note Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Note Content"
        value={content}
        onChangeText={setContent}
      />
      <Button title="Add Note" onPress={handleAddNote} />
    </View>
  );
};

export default AddNoteScreen;