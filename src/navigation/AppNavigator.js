import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import MainTabNavigator from './MainTabNavigator';

import AuthScreen from '../screens/AuthScreen';
import AuthUsernameScreen from '../screens/AuthUsernameScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import FFAScreen from '../screens/FFAScreen';

const AuthStack = createStackNavigator(
  {
    Auth: {
      screen: AuthScreen
    },
    AuthEmail: {
      screen: AuthUsernameScreen
    }
  },
  {
    defaultNavigationOptions: {
      header: null
    }
  }
);

const FFAStack = createStackNavigator(
  {
    FFA: {
      screen: FFAScreen
    }
  },
  {
    defaultNavigationOptions: {
      header: null
    }
  }
);

export default createAppContainer(
  createSwitchNavigator({
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStack,
    Main: MainTabNavigator,
    FFA: FFAStack
  })
);
