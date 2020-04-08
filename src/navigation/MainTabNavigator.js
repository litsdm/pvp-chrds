import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';

import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CameraScreen from '../screens/CameraScreen';
import MatchScreen from '../screens/MatchScreen';

import SettingsScreen from '../screens/SettingsScreen';
import GeneralScreen from '../screens/SettingsScreen/GeneralScreen';
import PrivacyScreen from '../screens/SettingsScreen/PrivacyScreen';
import FriendsScreen from '../screens/FriendsScreen';
import ProfileScreen from '../screens/ProfileScreen';

import TabBarIcon from '../components/TabBarIcon';
import TabBar from '../components/TabBar';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {
    defaultNavigationOptions: {
      header: null
    }
  }
});

const CameraStack = createStackNavigator(
  {
    Camera: {
      screen: CameraScreen
    }
  },
  {
    defaultNavigationOptions: {
      header: null
    }
  }
);

const SettingsStack = createStackNavigator(
  {
    Main: SettingsScreen,
    General: GeneralScreen,
    Privacy: PrivacyScreen,
    Friends: FriendsScreen,
    Profile: ProfileScreen
  },
  config
);

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    Settings: SettingsStack,
    Camera: CameraStack,
    Match: {
      screen: MatchScreen
    }
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      colorName="Home"
      name={Platform.OS === 'ios' ? 'ios-home' : 'md-home'}
    />
  )
};

const CategoriesStack = createStackNavigator(
  {
    Categories: CategoriesScreen
  },
  config
);

CategoriesStack.navigationOptions = {
  tabBarLabel: 'Categories',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} colorName="Home" name="ios-apps" />
  )
};

const tabBarConfig = {
  tabBarComponent: props => <TabBar {...props} />,
  tabBarOptions: {
    style: {
      borderRadius: 24
    }
  }
};

const tabNavigator = createBottomTabNavigator(
  {
    Home: HomeStack,
    Categories: CategoriesStack
  },
  tabBarConfig
);

export default tabNavigator;
