/* eslint-disable global-require */
import React, { useState } from 'react';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Provider } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { ApolloProvider } from '@apollo/react-hooks';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { setPurchaseListener } from 'expo-in-app-purchases';
import { bool } from 'prop-types';

import store from './src/reduxStore';
import client from './src/apolloStore';

import AppNavigator from './src/navigation/AppNavigator';
import PopupManager from './src/components/PopupManager';

const App = ({ skipLoadingScreen }) => {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  setPurchaseListener(result => {
    console.log(result);
  });

  const runAsync = async () => {
    try {
      await loadResourcesAsync();
      handleFinishLoading(setLoadingComplete);
      // SplashScreen.hide();
    } catch (exception) {
      handleLoadingError(exception);
    }
  };

  if (!isLoadingComplete && !skipLoadingScreen) {
    runAsync();
    return null;
  }

  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <View style={styles.container}>
          <SafeAreaView
            style={{ flex: 1, backgroundColor: '#fff' }}
            forceInset={{ top: 'never' }}
          >
            <StatusBar
              barStyle={
                Platform.OS === 'ios' ? 'dark-content' : 'light-content'
              }
            />
            <PopupManager />
            <AppNavigator />
          </SafeAreaView>
        </View>
      </Provider>
    </ApolloProvider>
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
      'sf-bold': require('./assets/fonts/SF-Pro-Text-Bold.otf'),
      'sf-medium': require('./assets/fonts/SF-Pro-Text-Medium.otf'),
      'sf-regular': require('./assets/fonts/SF-Pro-Text-Regular.otf'),
      'sf-light': require('./assets/fonts/SF-Pro-Text-Light.otf'),
      'sf-thin': require('./assets/fonts/SF-Pro-Text-Thin.otf')
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
    backgroundColor: '#FCFCFE'
  },
  statusBar: {
    backgroundColor: '#fff',
    left: 0,
    height: getStatusBarHeight(),
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 10
  }
});

App.propTypes = {
  skipLoadingScreen: bool
};

App.defaultProps = {
  skipLoadingScreen: false
};

export default App;
