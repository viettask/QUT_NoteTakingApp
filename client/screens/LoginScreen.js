// import necessary modules and components
import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from '../services/axios';  // Import Axios configuration
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
    // State variables for managing the form input values and error messages
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Function to handle login logic when the user clicks the Login button
    const handleLogin = async () => {
        console.log('=== LOGIN CLICKED ===');
        console.log('Username:', username); // Logging the entered username
        console.log('Password:', password); // Logging the entered password

        // Validation: Check if both username and password are entered
        if (!username.trim() || !password.trim()) {
            // Show an alert if either field is empty
            Alert.alert('Error', 'Please enter username and password');
            return;
        }

        console.log('Making login request...');

        try {
            // Making a POST request to the backend server for login authentication
            const response = await axios.post('http://10.0.2.2:3000/auth/login', {
                username: username.trim(), // Trim the username to remove extra spaces
                password: password.trim() // Trim the password to remove extra spaces
            });
            console.log('Login success:', response.data); // Logging successful login response

            // Store the user info (ID and username) in AsyncStorage for future sessions
            await AsyncStorage.setItem('userId', response.data.User.id.toString());
            await AsyncStorage.setItem('username', response.data.User.username);

            Alert.alert('Success', 'Login successful!'); // Show a success alert
            // Navigate to main tab screen after successful login
            navigation.replace('Main');
        } catch (error) {
            console.log('Login error:', error);  // Log any errors during the login attempt
            console.log('Error response:', error.response?.data); // Log the error response from the server (if available)
            const message = error.response?.data?.Message || 'Login failed'; // Default error message if no message is provided
            setErrorMessage(message); // Set the error message to display to the user
            Alert.alert('Error', message); // Show an alert with the error message
        }
    };

    return (

        // Main container for the login screen
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Note Taking App</Text>
            <Text style={styles.titleMessage}>Please enter your details</Text>

            {/* Display error message if it exists */}
            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

            {/* Input field for username */}
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                style={styles.input}
            />

            {/* Input field for password */}
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                style={styles.input}
            />
            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            {/* Gap between buttons */}
            <View style={styles.gap}></View>

            {/* Link to navigate to the Register screen if the user doesn't have an account */}
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerText}>
                    Don't have an account? <Text style={styles.registerLink}>Register</Text> {/* Display Register link */}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
// Styles for the LoginScreen components
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        color: '#007AFF',
        fontWeight: '600',
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        marginBottom: 10,
        padding: 8,
    },
    loginButton: {
        marginBottom: 10,  // Add margin below the Login button
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 6,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',  // Text color
        fontSize: 18,
    },
    gap: {
        height: 10,  // Adjust the height to create a gap between buttons
    },
    registerText: {
        textAlign: 'center',
        fontSize: 16,
    },
    registerLink: {
        color: '#007AFF', // Register link color
    },
    titleMessage: {
        fontSize: 16,
        marginBottom: 20
    },
    input: {
        borderWidth: 1,
        marginBottom: 10,
        padding: 8,
        borderRadius: 6
    }
});