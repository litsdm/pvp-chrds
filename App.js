/* eslint-disable global-require */
import React, { useState } from 'react';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { bool } from 'prop-types';

import AppNavigator from './src/navigation/AppNavigator';

const App = ({ skipLoadingScreen }) => {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  if (!isLoadingComplete && !skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: '#fff' }}
        forceInset={{ top: 'never' }}
      >
        <AppNavigator />
      </SafeAreaView>
    </View>
  );
};

const loadResourcesAsync = async () => {
  await Promise.all([
    Asset.loadAsync([require('./assets/images/icon.png')]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf')
    })
  ]);
};

const handleLoadingError = error => {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
};

const handleFinishLoading = setLoadingComplete => {
  setLoadingComplete(true);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: getStatusBarHeight()
  }
});

App.propTypes = {
  skipLoadingScreen: bool
};

App.defaultProps = {
  skipLoadingScreen: false
};

export default App;
