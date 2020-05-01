import { AppRegistry, Platform } from 'react-native';
import App from './App';

AppRegistry.registerComponent(
  Platform.OS === 'ios' ? 'charades' : 'main',
  () => App
);
