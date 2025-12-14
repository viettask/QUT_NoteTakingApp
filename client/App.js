import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import NoteScreen from './screens/NoteScreen';
import AboutScreen from './screens/AboutScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


// Bottom tabs after login
function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{
      tabBarLabelStyle: {
        fontSize: 16,
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
  return (
    <NavigationContainer >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Auth screens come first */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        {/* Main app after login */}
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
