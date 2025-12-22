import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Creating a context to hold the font size value
const FontSizeContext = createContext();

// Custom hook to access the FontSizeContext
export const useFontSize = () => useContext(FontSizeContext);

// The FontSizeProvider component is used to wrap your app and provide font size context
export const FontSizeProvider = ({ children }) => {
    // Setting up the state to store the current font size, defaulting to 'small'
    const [fontSize, setFontSize] = useState('small');

    // useEffect hook to load the font size from AsyncStorage when the app mounts
    useEffect(() => {
        // Function to load the stored font size from AsyncStorage
        const loadFontSize = async () => {
            // Retrieve font size value from AsyncStorage
            const storedFontSize = await AsyncStorage.getItem('fontSize');
            // If a font size is stored, set it in the state
            if (storedFontSize) {
                setFontSize(storedFontSize);
            }
        };
        // Load font size when the component mounts
        loadFontSize();
    }, []);

    // Function to update the font size and store it in AsyncStorage
    const updateFontSize = async (newSize) => {
        // Update the font size in state
        setFontSize(newSize);
        // Save the new font size to AsyncStorage for persistence
        await AsyncStorage.setItem('fontSize', newSize);
    };

    return (
        // FontSizeContext.Provider provides the fontSize and updateFontSize function to the entire app
        <FontSizeContext.Provider value={{ fontSize, updateFontSize }}>
            {children}
        </FontSizeContext.Provider>
    );
};