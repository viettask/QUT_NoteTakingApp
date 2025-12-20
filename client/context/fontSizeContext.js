import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FontSizeContext = createContext();

export const useFontSize = () => useContext(FontSizeContext);

export const FontSizeProvider = ({ children }) => {
    const [fontSize, setFontSize] = useState('small'); // Default font size

    useEffect(() => {
        const loadFontSize = async () => {
            const storedFontSize = await AsyncStorage.getItem('fontSize');
            if (storedFontSize) {
                setFontSize(storedFontSize);
            }
        };
        loadFontSize();
    }, []);

    const updateFontSize = async (newSize) => {
        setFontSize(newSize);
        await AsyncStorage.setItem('fontSize', newSize);
    };

    return (
        <FontSizeContext.Provider value={{ fontSize, updateFontSize }}>
            {children}
        </FontSizeContext.Provider>
    );
};