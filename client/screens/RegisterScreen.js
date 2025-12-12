import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from '../services/axios';  // Import Axios configuration

export default function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleRegister = async () => {
        console.log('=== REGISTER CLICKED ===');
        console.log('Username:', username);
        console.log('Password:', password);

        // Validation
        if (!username.trim() || !password.trim) {
            console.log('Validation failed');
            setErrorMessage('Username and password are required');
            return;
        }

        try {
            // Change localhost to your computer's IP address for real device
            // For Android emulator: use 10.0.2.2
            // For iOS simulator: use localhost
            const response = await axios.post('http://10.0.2.2:3000/auth/register', {
                username: username.trim(),
                password: password.trim()
            });
            console.log('Registration success:', response.data);

            // Navigate to login screen after successful registration
            //   navigation.replace('Login');
            Alert.alert('Success', 'Registration successful!', [
                { text: 'OK', onPress: () => navigation.replace('Login') }
            ]);


        } catch (error) {
            console.error('Registration error:', error);
            const message = error.response?.data?.Message || 'Registration failed';
            setErrorMessage(message);
            Alert.alert('Error', message);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Register</Text>
            {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}

            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={(text) => {
                    console.log('Username changed:', text); // Add this
                    setUsername(text);
                }}
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={(text) => {
                    console.log('Password changed:', text); // Add this
                    setPassword(text);
                }}
                secureTextEntry
                style={{ borderWidth: 1, marginBottom: 20, padding: 8 }}
            />
            <Button title="Register" onPress={handleRegister} />
            <Button title="Go to Login" onPress={() => navigation.navigate('Login')} />
        </View>
    );
}