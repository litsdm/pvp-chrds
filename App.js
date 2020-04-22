/* eslint-disable global-require, react/no-this-in-sfc  */
import React, { useEffect, useState } from 'react';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import {
  AppState,
  Keyboard,
  Platform,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect, Provider } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { ApolloProvider, useMutation } from '@apollo/react-hooks';
import {
  setPurchaseListener,
  finishTransactionAsync,
  IAPResponseCode
} from 'expo-in-app-purchases';
import SplashScreen from 'react-native-splash-screen';
import JwtDecode from 'jwt-decode';
import { bool, func, object } from 'prop-types';

import ADD_COINS from './src/graphql/mutations/addCoins';
import MAKE_PRO from './src/graphql/mutations/makePro';

import store from './src/reduxStore';
import client from './src/apolloStore';

import AppNavigator from './src/navigation/AppNavigator';
import PopupManager from './src/components/PopupManager';
import { toggleBadge, togglePurchasePopup } from './src/actions/popup';
import { upload, uploadFFA } from './src/actions/file';
import { setRefetchUser } from './src/actions/user';
import { loadLocalCache } from './src/actions/cache';

const mapDispatchToProps = dispatch => ({
  displayBadge: (message, type) => dispatch(toggleBadge(true, message, type)),
  closePurchase: () => dispatch(togglePurchasePopup(false)),
  uploadFile: data => dispatch(upload(data)),
  uploadFFAFile: data => dispatch(uploadFFA(data)),
  askRefetchUser: () => dispatch(setRefetchUser(true)),
  loadCache: () => dispatch(loadLocalCache())
});

const mapStateToProps = ({ file: { videos }, cache }) => ({
  videos,
  cache
});

const purchasedCoins = Platform.select({
  ios: {
    'dev.products.coins_small': 80,
    'dev.products.coins_medium': 500,
    'dev.products.coins_large': 1200
  },
  android: {
    coins_small: 80,
    coins_medium: 500,
    coins_large: 1200
  }
});

let _cache = {};

const App = ({
  skipLoadingScreen,
  displayBadge,
  closePurchase,
  videos,
  uploadFile,
  uploadFFAFile,
  askRefetchUser,
  cache,
  loadCache
}) => {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [didCheckBroken, setDidCheckBroken] = useState(false);
  const [addCoins] = useMutation(ADD_COINS);
  const [makePro] = useMutation(MAKE_PRO);

  this.videos = videos;
  _cache = cache;

  useEffect(() => {
    checkBrokenUpload();
    loadCache();
    AppState.addEventListener('change', handleStateChange);
    Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
    return () => {
      AppState.removeEventListener('change', handleStateChange);
      Keyboard.removeListener('keyboardDidShow');
    };
  }, []);

  const handleKeyboardShow = async ({ endCoordinates }) => {
    const keyboardSize = await AsyncStorage.getItem('keyboardSize');
    if (!keyboardSize)
      await AsyncStorage.setItem('keyboardSize', `${endCoordinates.height}`);
  };

  const handleStateChange = nextAppState => {
    if (nextAppState.match(/inactive|background/)) {
      AsyncStorage.setItem('cache', JSON.stringify(_cache));
      if (Object.keys(this.videos).length > 0)
        AsyncStorage.setItem('brokenUploadData', JSON.stringify(this.videos));
    }
    if (nextAppState === 'active' && didCheckBroken) {
      AsyncStorage.removeItem('brokenUploadData');
    }
  };

  const checkBrokenUpload = async () => {
    const videoData = await AsyncStorage.getItem('brokenUploadData');
    if (videoData) {
      const vids = JSON.parse(videoData);
      Object.values(vids).forEach(file =>
        file.sender ? uploadFFAFile(file) : uploadFile(file)
      );
      await AsyncStorage.removeItem('brokenUploadData');
    }
    setDidCheckBroken(true);
  };

  const runAsync = async () => {
    try {
      await loadResourcesAsync();
      handleFinishLoading(setLoadingComplete);
      SplashScreen.hide();
    } catch (exception) {
      handleLoadingError(exception);
    }
  };

  if (!isLoadingComplete && !skipLoadingScreen) {
    runAsync();
    return null;
  }

  const handlePurchaseAcknowledge = async purchase => {
    const token = await AsyncStorage.getItem('CHRDS_TOKEN');

    const { _id } = JwtDecode(token);
    const coins = purchasedCoins[purchase.productId];
    const isSubscription = purchase.productId.match(
      /dev.products.pro|pro_monthly/
    );

    try {
      await finishTransactionAsync(purchase, !isSubscription);

      if (isSubscription) await makePro({ variables: { _id, coins: 180 } });
      else await addCoins({ variables: { _id, coins } });

      displayBadge('Successful transaction.', 'success');
      closePurchase();

      askRefetchUser();
    } catch (exception) {
      console.log(exception.message);
      displayBadge('There was an issue completing your transaction.');
    }
  };

  setPurchaseListener(({ responseCode, results, errorCode }) => {
    if (responseCode === IAPResponseCode.OK) {
      results.forEach(purchase => {
        if (!purchase.acknowledged) handlePurchaseAcknowledge(purchase);
      });
    } else if (responseCode === IAPResponseCode.USER_CANCELED) {
      displayBadge('Transaction was cancelled.', 'default');
    } else if (responseCode === IAPResponseCode.DEFERRED) {
      console.log(
        'User does not have permissions to buy but requested parental approval (iOS only)'
      );
    } else {
      displayBadge(
        "We couldn't complete your order, please try again or contact support.",
        'error'
      );
      console.warn(
        `Something went wrong with the purchase. Received errorCode ${errorCode}`
      );
    }
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <PopupManager />
      <AppNavigator />
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
  skipLoadingScreen: bool,
  displayBadge: func.isRequired,
  closePurchase: func.isRequired,
  uploadFile: func.isRequired,
  uploadFFAFile: func.isRequired,
  askRefetchUser: func.isRequired,
  loadCache: func.isRequired,
  videos: object,
  cache: object
};

App.defaultProps = {
  skipLoadingScreen: false,
  videos: {},
  cache: {}
};

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

export default () => (
  <ApolloProvider client={client}>
    <Provider store={store}>
      <ConnectedApp />
    </Provider>
  </ApolloProvider>
);
