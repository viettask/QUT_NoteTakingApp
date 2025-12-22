// import necessary modules and components
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, TextInput, Modal, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../services/axios';
// Import the font size context hook
import { useFontSize } from '../context/fontSizeContext';

export default function SettingsScreen({ navigation }) {
    // State variables for user data, modals and notification settings
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

    // Notification settings
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    // font size from context
    const { fontSize, updateFontSize } = useFontSize();

    // Load user data and notification settings on component mount
    useEffect(() => {
        loadUserData();
        loadNotificationSettings();
    }, []);

    // Load user data from AsyncStorage (username and userId)
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

    // Load notification settings from AsyncStorage
    const loadNotificationSettings = async () => {
        try {
            const notifEnabled = await AsyncStorage.getItem('notificationsEnabled');
            setNotificationsEnabled(notifEnabled === 'true');
        } catch (error) {
            console.error('Error loading notification settings:', error);
        }
    };

    // Toggle notification settings and save to AsyncStorage
    const toggleNotifications = async (value) => {
        try {
            setNotificationsEnabled(value);
            await AsyncStorage.setItem('notificationsEnabled', value.toString());

            if (value) {
                Alert.alert('Notifications Enabled', 'You will now receive notifications');
            } else {
                Alert.alert('Notifications Disabled', 'You will not receive notifications');
            }
        } catch (error) {
            console.error('Error saving notification settings:', error);
        }
    };

    // Toggle font size between 'small' and 'big' and update it in the context
    const toggleFontSize = async (value) => {
        try {
            await updateFontSize(value);
            //await AsyncStorage.setItem('fontSize', value);

            Alert.alert('Font Size Changed', `The font size is now set to ${value}`);
        } catch (error) {
            console.error('Error saving font size:', error);
        }
    };

    // Handle username change
    const handleChangeUsername = async () => {
        if (!newUsername.trim()) {
            Alert.alert('Error', 'Please enter a new username');
            return;
        }

        try {
            const response = await axios.put(`http://10.0.2.2:3000/auth/update-username/${userId}`, {
                username: newUsername.trim(),
            });

            // Update AsyncStorage and UI with new username
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

    // Handle password change
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

    // Handle user logout and remove stored date from AsyncStorage
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

    // Clear all data stored in AsyncStorage and navigate to Login screen
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
                        <Text style={[styles.avatarText]}>
                            {username.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                    <Text style={[styles.username, fontSize === 'big' ? styles.bigText : styles.smallText]}>{username}</Text>
                </View>

                {/* Account Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, fontSize === 'big' ? styles.bigText : styles.smallText]}>Account</Text>

                    {/* Change Username Button */}
                    <TouchableOpacity
                        style={[styles.option]}
                        onPress={() => setShowUsernameModal(true)}
                    >
                        <Text style={[styles.optionText, fontSize === 'big' ? styles.bigText : styles.smallText]}>Change username</Text>
                    </TouchableOpacity>
                    {/* Change Password Button */}
                    <TouchableOpacity
                        style={styles.option}
                        onPress={() => setShowPasswordModal(true)}
                    >
                        <Text style={[styles.optionText, fontSize === 'big' ? styles.bigText : styles.smallText]}>Change password</Text>
                    </TouchableOpacity>
                    {/* Logout Button */}
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={[styles.logoutButtonText, fontSize === 'big' ? styles.bigText : styles.smallText]}>Logout</Text>
                    </TouchableOpacity>
                </View>

                {/* App Settings Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, fontSize === 'big' ? styles.bigText : styles.smallText]}>App Settings</Text>


                    {/* Notification Toggle */}
                    <View style={styles.optionWithSwitch}>
                        <View style={styles.optionTextContainer}>
                            <Text style={[styles.optionText, fontSize === 'big' ? styles.bigText : styles.smallText]}>Notifications</Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                            thumbColor={notificationsEnabled ? '#007AFF' : '#c0b6c0ff'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleNotifications}
                            value={notificationsEnabled}
                        />
                    </View>

                    {/* Font Size Toggle */}
                    <View style={styles.optionWithSwitch}>
                        <View style={styles.optionTextContainer}>
                            <Text style={[styles.optionText, fontSize === 'big' ? styles.bigText : styles.smallText]}>Font Size -  small/big</Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                            thumbColor={fontSize === 'big' ? '#007AFF' : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => toggleFontSize(fontSize === 'small' ? 'big' : 'small')}
                            value={fontSize === 'big'}
                        />
                    </View>
                    {/* Clear Data Button */}
                    <TouchableOpacity style={styles.option} onPress={handleClearData}>
                        <Text style={[styles.optionText, styles.dangerText, fontSize === 'big' ? styles.bigText : styles.smallText]}>Clear Data</Text>
                    </TouchableOpacity>
                </View>

                {/* About Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, fontSize === 'big' ? styles.bigText : styles.smallText]}>About</Text>

                    <TouchableOpacity style={styles.option}>
                        <Text style={[styles.optionText, fontSize === 'big' ? styles.bigText : styles.smallText]}>Version 1.0.0</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.option}>
                        <Text style={[styles.optionText, fontSize === 'big' ? styles.bigText : styles.smallText]}>Terms of Service</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.option}>
                        <Text style={[styles.optionText, fontSize === 'big' ? styles.bigText : styles.smallText]}>Privacy Policy</Text>
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

// Styles for the SettingsScreen components
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    profileSection: {
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 15,
        borderRadius: 6,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
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
        padding: 15,
        borderRadius: 6,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
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
        borderBottomColor: '#f0f0f0'
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
    optionWithSwitch: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    optionTextContainer: {
        flex: 1,
    },
    smallText: {
        fontSize: 16, // Default small font size
    },
    bigText: {
        fontSize: 20, // Larger font size
    },
});