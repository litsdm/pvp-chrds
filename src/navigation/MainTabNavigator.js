import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';

import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import TabBarIcon from '../components/TabBarIcon';
import TabBarApple from '../components/TabBar';
import TabBarAndroid from '../components/TabBarAndroid';

const TabBar = Platform.OS === 'ios' ? TabBarApple : TabBarAndroid;

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {
    defaultNavigationOptions: {
      header: null
    }
  }
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen
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
    <TabBarIcon
      focused={focused}
      colorName={Platform.OS === 'ios' ? 'Home' : 'Categories'}
      name="ios-apps"
    />
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
