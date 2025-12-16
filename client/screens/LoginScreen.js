import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from '../services/axios';  // Import Axios configuration
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        console.log('=== LOGIN CLICKED ===');
        console.log('Username:', username);
        console.log('Password:', password);

        // Validation
        if (!username.trim() || !password.trim()) {
            Alert.alert('Error', 'Please enter username and password');
            return;
        }

        console.log('Making login request...');

        try {
            const response = await axios.post('http://10.0.2.2:3000/auth/login', {
                username: username.trim(),
                password: password.trim()
            });
            console.log('Login success:', response.data);

            // Store user info
            await AsyncStorage.setItem('userId', response.data.User.id.toString());
            await AsyncStorage.setItem('username', response.data.User.username);

            Alert.alert('Success', 'Login successful!');
            // Navigate to main tab screen after successful login
            navigation.replace('Main');
        } catch (error) {
            console.log('Login error:', error);
            console.log('Error response:', error.response?.data);
            const message = error.response?.data?.Message || 'Login failed';
            setErrorMessage(message);
            Alert.alert('Error', message);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <Text style={{ fontSize: 24, marginBottom: 20, textAlign: 'center', color: '#007AFF', fontWeight: '600' }}>Welcome to Note Taking App</Text>

            {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}

            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />

            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                style={{ borderWidth: 1, marginBottom: 20, padding: 8 }}
            />
            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            {/* Gap between buttons */}
            <View style={styles.gap}></View>

            {/* Go to Register Button */}
            <Text>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}> Register</Text>
            </TouchableOpacity>
        </View>
    );
}

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
    }
});