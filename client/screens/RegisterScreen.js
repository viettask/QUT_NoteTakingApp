// import necessary modules and components
import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from '../services/axios';  // Import Axios configuration

export default function RegisterScreen({ navigation }) {
    // States for username, password, and error message
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Function to handle user registration
    const handleRegister = async () => {
        console.log('=== REGISTER CLICKED ===');
        console.log('Username:', username);
        console.log('Password:', password);

        // Validation : Check if both username and password are provided
        if (!username.trim() || !password.trim) {
            console.log('Validation failed');
            setErrorMessage('Username and password are required');
            return;
        }

        try {
            // Send a POST request to register the user
            // Change localhost to your computer's IP address for real devices
            // For Android emulator: use 10.0.2.2, for iOS simulator: use localhost
            const response = await axios.post('http://10.0.2.2:3000/auth/register', {
                username: username.trim(),
                password: password.trim()
            });
            console.log('Registration success:', response.data);

            // Show success alert and navigate to login screen after registration
            Alert.alert('Success', 'Registration successful!', [
                { text: 'OK', onPress: () => navigation.replace('Login') }
            ]);


        } catch (error) {
            // Handle error during registration
            console.error('Registration error:', error);
            const message = error.response?.data?.Message || 'Registration failed';
            // Set error message to display to the user
            setErrorMessage(message);
            // Show alert with error message
            Alert.alert('Error', message);
        }
    };

    return (
        <View style={styles.container}>
            {/* Title for the screen */}
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.titleMessage}>Register your account to explore Note Taking App features</Text>

            {/* Display error message if there is one */}
            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
            {/* Input field for username */}
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={(text) => {
                    console.log('Username changed:', text); // Add this
                    setUsername(text);
                }}
                style={styles.input}
            />
            {/* Input field for password */}
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={(text) => {
                    console.log('Password changed:', text); // Add this
                    setPassword(text);
                }}
                secureTextEntry
                style={styles.input}
            />


            {/* Register Button - Tapping calls handleRegister function */}
            <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            {/* Gap between buttons */}
            <View style={styles.gap}></View>

            {/* Navigate to login screen if the user already has an account */}
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.registerText}>
                    Already have an account? <Text style={styles.registerLink}>Log in</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
}

// Styles for the RegisterScreen components
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