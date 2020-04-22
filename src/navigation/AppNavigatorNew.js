/* import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AuthScreen from '../screens/AuthScreen';
import AuthUsernameScreen from '../screens/AuthUsernameScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import FFAScreen from '../screens/FFAScreen';
import BottomTabNavigator from './BottomTabNavigator';

const AuthStack = createStackNavigator();

const AuthStackScreen = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Auth" component={AuthScreen} />
    <AuthStack.Screen name="AuthEmail" component={AuthUsernameScreen} />
  </AuthStack.Navigator>
);

const Stack = createStackNavigator();

export default () => (
  <SafeAreaProvider>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
        <Stack.Screen name="Auth" component={AuthStackScreen} />
        <Stack.Screen name="FFA" component={FFAScreen} />
        <Stack.Screen name="Main" component={BottomTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  </SafeAreaProvider>
); */
