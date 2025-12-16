import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, TextInput, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../services/axios';

export default function SettingsScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState(null);

    // Change username modal
    const [showUsernameModal, setShowUsernameModal] = useState(false);
    const [newUsername, setNewUsername] = useState('');

    // Change password modal
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const storedUsername = await AsyncStorage.getItem('username');
            const storedUserId = await AsyncStorage.getItem('userId');
            setUsername(storedUsername || 'User');
            setUserId(storedUserId);
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    const handleChangeUsername = async () => {
        if (!newUsername.trim()) {
            Alert.alert('Error', 'Please enter a new username');
            return;
        }

        try {
            const response = await axios.put(`http://10.0.2.2:3000/auth/update-username/${userId}`, {
                username: newUsername.trim(),
            });

            // Update AsyncStorage
            await AsyncStorage.setItem('username', newUsername.trim());
            setUsername(newUsername.trim());
            setNewUsername('');
            setShowUsernameModal(false);
            Alert.alert('Success', 'Username updated successfully!');
        } catch (error) {
            console.error('Error updating username:', error.Message);
            Alert.alert('Error', error.response?.data?.Message || 'Failed to update username');
        }
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New passwords do not match');
            return;
        }

        if (newPassword.length < 4) {
            Alert.alert('Error', 'Password must be at least 4 characters');
            return;
        }

        try {
            const response = await axios.put(`http://10.0.2.2:3000/auth/update-password/${userId}`, {
                currentPassword: currentPassword,
                newPassword: newPassword,
            });

            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setShowPasswordModal(false);
            Alert.alert('Success', 'Password updated successfully!');
        } catch (error) {
            console.error('Error updating password:', error);
            Alert.alert('Error', error.response?.data?.Message || 'Failed to update password');
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    onPress: async () => {
                        await AsyncStorage.removeItem('userId');
                        await AsyncStorage.removeItem('username');
                        console.log('User logged out');
                        navigation.replace('Login');
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    const handleClearData = () => {
        Alert.alert(
            'Clear Data',
            'This will clear all your local data. Are you sure?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    onPress: async () => {
                        await AsyncStorage.clear();
                        console.log('Data cleared');
                        Alert.alert('Success', 'Data cleared successfully');
                        navigation.replace('Login');
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }} showsVerticalScrollIndicator={true}>
                {/* User Profile */}
                <View style={styles.profileSection}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {username.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                    <Text style={styles.username}>{username}</Text>
                </View>

                {/* Account Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>

                    <TouchableOpacity
                        style={styles.option}
                        onPress={() => setShowUsernameModal(true)}
                    >
                        <Text style={styles.optionText}>Change username</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.option}
                        onPress={() => setShowPasswordModal(true)}
                    >
                        <Text style={styles.optionText}>Change password</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                </View>

                {/* App Settings Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>App Settings</Text>

                    <TouchableOpacity style={styles.option}>
                        <Text style={styles.optionText}>Notifications</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.option}>
                        <Text style={styles.optionText}>Privacy</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.option} onPress={handleClearData}>
                        <Text style={[styles.optionText, styles.dangerText]}>Clear Data</Text>
                    </TouchableOpacity>
                </View>

                {/* About Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>

                    <TouchableOpacity style={styles.option}>
                        <Text style={styles.optionText}>Version 1.0.0</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.option}>
                        <Text style={styles.optionText}>Terms of Service</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.option}>
                        <Text style={styles.optionText}>Privacy Policy</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>


            {/* Change Username Modal */}
            <Modal
                visible={showUsernameModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowUsernameModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Change Username</Text>
                        <Text style={styles.modalSubtitle}>Current: {username}</Text>
                        
                        <TextInput
                            style={styles.input}
                            placeholder="New username"
                            value={newUsername}
                            onChangeText={setNewUsername}
                            autoCapitalize="none"
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => {
                                    setNewUsername('');
                                    setShowUsernameModal(false);
                                }}
                            >
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={handleChangeUsername}
                            >
                                <Text style={styles.modalButtonText}>Update</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Change Password Modal */}
            <Modal
                visible={showPasswordModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowPasswordModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Change Password</Text>
                        
                        <TextInput
                            style={styles.input}
                            placeholder="Current password"
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            secureTextEntry
                            autoCapitalize="none"
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="New password"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                            autoCapitalize="none"
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            autoCapitalize="none"
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => {
                                    setCurrentPassword('');
                                    setNewPassword('');
                                    setConfirmPassword('');
                                    setShowPasswordModal(false);
                                }}
                            >
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={handleChangePassword}
                            >
                                <Text style={styles.modalButtonText}>Update</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    profileSection: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatarText: {
        fontSize: 36,
        color: '#fff',
        fontWeight: 'bold',
    },
    username: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    option: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    dangerText: {
        color: '#ff3b30',
    },
    logoutButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 20,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '85%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    modalButton: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#999',
    },
    confirmButton: {
        backgroundColor: '#007AFF',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});