// Import necessary modules and components from React, React Native, and other libraries
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as SplashScreen from 'expo-splash-screen';
import { FontSizeProvider, useFontSize } from './context/fontSizeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import screens used in the app
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import NoteScreen from './screens/NoteScreen';
import AboutScreen from './screens/AboutScreen';
import SettingsScreen from './screens/SettingsScreen';

// Create navigators for stack and tab navigation
const Stack = createNativeStackNavigator(); // Stack navigator for authentication and main app
const Tab = createBottomTabNavigator(); // Bottom tab navigator for main app screens

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Function to render the bottom tab navigator with dynamic font size after login
function MainTabs() {
  const { fontSize } = useFontSize(); // Use the context value for font size
  const tabFontSize = fontSize === 'big' ? 20 : 16; // Determine tab font size based on context

  console.log('Current fontSize:', fontSize); // Debug log to check if context is working

  return (
    <Tab.Navigator key={fontSize} // Force re-render when fontSize changes
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: tabFontSize,  // Adjust font size based on context
          fontWeight: '600',
          marginBottom: 5,
        },
        tabBarStyle: {
          height: 100,  // Set tab bar height
          paddingBottom: 5, // Padding at the bottom
        },
        tabBarActiveTintColor: '#007AFF',  // Set active tab color
        tabBarInactiveTintColor: '#999',   // Set inactive tab color
      }}>
      {/* Tabs for Notes, About, and Settings screens */}
      <Tab.Screen name="Notes" component={NoteScreen} options={{
        tabBarIcon: ({ focused, color }) => (
          <Text>
            {focused ? '📝' : '📄'}
          </Text>
        ),
      }} />
      <Tab.Screen name="About" component={AboutScreen} options={{
        tabBarIcon: ({ focused, color }) => (
          <Text>
            {focused ? 'ℹ️' : 'ⓘ'}
          </Text>
        ),
      }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{
        tabBarIcon: ({ focused, color }) => (
          <Text>
            {focused ? '⚙️' : '⚙'}
          </Text>
        ),
      }} />
    </Tab.Navigator>
  );
}

// Main App component
export default function App() {
  const [appIsReady, setAppIsReady] = useState(false); // State to track if the app is ready

  // Prepare the app (e.g., load resources) before rendering
  useEffect(() => {
    async function prepare() {
      try {
        // Keep splash screen visible for 5 seconds
        await new Promise(resolve => setTimeout(resolve, 5000));

        // You can also load resources here
        // await loadFonts();
        // await loadData();
      } catch (e) {
        // Log any errors encountered during preparation
        console.warn(e);
      } finally {
        // Set appIsReady to true to indicate readiness
        setAppIsReady(true);
      }
    }

    prepare(); // Call the prepare function to load resources
  }, []);

  // Hide the splash screen once the app is ready
  useEffect(() => {
    async function hideSplash() {
      if (appIsReady) {
        // Hide the splash screen after resources are ready
        await SplashScreen.hideAsync();
      }
    }

    hideSplash(); // Call the function to hide splash screen
  }, [appIsReady]);

  if (!appIsReady) {
    return null; // Show nothing while splash screen is visible
  }

  return (
    // FontSizeProvider context provider to manage font size across the app
    <FontSizeProvider>
      {/* Navigation container to manage all navigation state */}
      <NavigationContainer >
        {/* Stack Navigator to manage the stack of screens */}
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Auth screens come first */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          {/* Main app after login */}
          <Stack.Screen name="Main" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </FontSizeProvider>
  );
}

// Styles for the app
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallText: {
    fontSize: 16, // Default small font size
  },
  bigText: {
    fontSize: 20, // Larger font size
  },
});
