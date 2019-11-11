/* eslint-disable global-require */
import React, { useState } from 'react';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { bool } from 'prop-types';

import AppNavigator from './src/navigation/AppNavigator';

const client = new ApolloClient({
  uri: 'http://localhost:8080'
});

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
    <ApolloProvider client={client}>
      <View style={styles.container}>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: '#fff' }}
          forceInset={{ top: 'never' }}
        >
          <AppNavigator />
        </SafeAreaView>
      </View>
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
  }
});

App.propTypes = {
  skipLoadingScreen: bool
};

App.defaultProps = {
  skipLoadingScreen: false
};

export default App;
