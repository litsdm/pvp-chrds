import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import MainTabNavigator from './MainTabNavigator';

import CameraScreen from '../screens/CameraScreen';

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
    Main: MainTabNavigator,
    Camera: CameraStack
  })
);
