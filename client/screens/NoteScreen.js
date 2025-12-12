import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import axios from '../services/axios';  // Import Axios configuration

const NotesScreen = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('/notes');
        setNotes(response.data);  // Set the notes fetched from the server
      } catch (error) {
        console.error('Error fetching notes', error);
      }
    };

    fetchNotes();
  }, []);

  return (
    <View>
      <Text>Notes</Text>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.title}</Text>
            <Text>{item.content}</Text>
          </View>
        )}
      />
      <Button title="Add New Note" onPress={() => {/* Navigate to AddNote screen */}} />
    </View>
  );
};

export default NotesScreen;