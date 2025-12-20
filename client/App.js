import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as SplashScreen from 'expo-splash-screen';
import { FontSizeProvider, useFontSize } from './context/fontSizeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import NoteScreen from './screens/NoteScreen';
import AboutScreen from './screens/AboutScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Bottom tabs after login
function MainTabs() {
  const { fontSize } = useFontSize(); // Use the context value for font size
  const tabFontSize = fontSize === 'big' ? 20 : 16;

  console.log('Current fontSize:', fontSize); // Debug log to check if context is working

  return (
    <Tab.Navigator key={fontSize} // ADD THIS - forces remount when fontSize changes
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: tabFontSize,  // Adjust font size based on context
          fontWeight: '600',
          marginBottom: 5,
        },
        tabBarStyle: {
          height: 100,  // Tab bar height
          paddingBottom: 5,
        },
        tabBarActiveTintColor: '#007AFF',  // Active tab color
        tabBarInactiveTintColor: '#999',   // Inactive tab color
      }}>
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

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);


  useEffect(() => {
    async function prepare() {
      try {
        // Keep splash screen visible for 5 seconds
        await new Promise(resolve => setTimeout(resolve, 5000));

        // You can also load resources here
        // await loadFonts();
        // await loadData();
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    async function hideSplash() {
      if (appIsReady) {
        // Hide the splash screen
        await SplashScreen.hideAsync();
      }
    }

    hideSplash();
  }, [appIsReady]);

  if (!appIsReady) {
    return null; // Show nothing while splash screen is visible
  }



  return (
    <FontSizeProvider>
      <NavigationContainer >
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
