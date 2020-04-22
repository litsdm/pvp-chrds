/* import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import CameraScreen from '../screens/CameraScreen';
import MatchScreen from '../screens/MatchScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProfileFFAScreen from '../screens/ProfileFFAScreen';

import CategoriesScreen from '../screens/CategoriesScreen';

import SettingsScreen from '../screens/SettingsScreen';
import GeneralScreen from '../screens/SettingsScreen/GeneralScreen';
import PrivacyScreen from '../screens/SettingsScreen/PrivacyScreen';
import FriendsScreen from '../screens/FriendsScreen';

import TabBarIcon from '../components/TabBarIcon';
import TabBar from '../components/TabBar';

const HomeStack = createStackNavigator();

const HomeStackScreen = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="Home" component={HomeScreen} />
    <HomeStack.Screen name="Match" component={MatchScreen} />
    <HomeStack.Screen name="Camera" component={CameraScreen} />
    <HomeStack.Screen name="Profile" component={ProfileScreen} />
    <HomeStack.Screen name="ProfileFFA" component={ProfileFFAScreen} />
    <HomeStack.Screen name="Settings" component={SettingsScreen} />
    <HomeStack.Screen name="General" component={GeneralScreen} />
    <HomeStack.Screen name="Privacy" component={PrivacyScreen} />
    <HomeStack.Screen name="Friends" component={FriendsScreen} />
  </HomeStack.Navigator>
);

const BottomTab = createBottomTabNavigator();

export default () => (
  <BottomTab.Navigator
    initialRouteName="Home"
    tabBar={props => <TabBar {...props} />}
  >
    <BottomTab.Screen
      name="Home"
      component={HomeStackScreen}
      options={{
        title: 'Home',
        tabBarIcon: ({ focused }) => (
          <TabBarIcon
            focused={focused}
            colorName="Home"
            name={Platform.OS === 'ios' ? 'ios-home' : 'md-home'}
          />
        )
      }}
    />
    <BottomTab.Screen
      name="Categories"
      component={CategoriesScreen}
      options={{
        title: 'Categories',
        tabBarIcon: ({ focused }) => (
          <TabBarIcon focused={focused} colorName="Home" name="ios-apps" />
        )
      }}
    />
  </BottomTab.Navigator>
); */
