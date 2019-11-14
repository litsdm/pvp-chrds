import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import MainTabNavigator from './MainTabNavigator';

import AuthScreen from '../screens/AuthScreen';
import AuthEmailScreen from '../screens/AuthEmailScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import CameraScreen from '../screens/CameraScreen';

const AuthStack = createStackNavigator(
  {
    Auth: {
      screen: AuthScreen
    },
    AuthEmail: {
      screen: AuthEmailScreen
    }
  },
  {
    defaultNavigationOptions: {
      header: null
    }
  }
);

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

export default createAppContainer(
  createSwitchNavigator({
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStack,
    Main: MainTabNavigator,
    Camera: CameraStack
  })
);
