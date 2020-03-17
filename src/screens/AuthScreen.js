import React from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import * as Facebook from 'expo-facebook';
import {
  signInAsync,
  AppleAuthenticationScope
} from 'expo-apple-authentication';
import jwtDecode from 'jwt-decode';
import { func, object } from 'prop-types';

import callApi from '../helpers/apiCaller';
import { togglePickUsername } from '../actions/popup';

import OnBoarding from '../components/Auth/OnBoarding';

import Layout from '../constants/Layout';

const mapDispatchToProps = dispatch => ({
  showPickUsername: data => dispatch(togglePickUsername(true, data))
});

const PRE_ICON = Platform.OS === 'ios' ? 'ios' : 'md';

const AuthScreen = ({ navigation, showPickUsername }) => {
  const goToSignUp = () => navigation.navigate('AuthEmail', { isNew: true });
  const goToLogin = () => navigation.navigate('AuthEmail', { isNew: false });

  const loginWithFacebook = async () => {
    try {
      const user = await facebookAuth();
      const response = await callApi('facebook', user, 'POST');
      const { token, message } = await response.json();

      if (message === 'displayUserPick') {
        showPickUsername({
          name: user.first_name || user.name.split(' ')[0],
          facebookID: user.id,
          friends: user.friends,
          onSuccess: handleSuccess
        });
        return;
      }

      handleSuccess(token);
    } catch (exception) {
      console.log(exception.message);
    }
  };

  const loginWithApple = async () => {
    try {
      const user = await appleAuth();
      const response = await callApi('apple', user, 'POST');
      const { token, message } = await response.json();

      if (message === 'displayUserPick') {
        showPickUsername({ ...user, onSuccess: handleSuccess });
        return;
      }

      handleSuccess(token);
    } catch (exception) {
      console.log(exception);
    }
  };

  const handleSuccess = async token => {
    const { _id } = jwtDecode(token);
    await AsyncStorage.setItem('CHRDS_TOKEN', token);
    navigation.navigate('Home', { userID: _id });
  };

  return (
    <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'never' }}>
      <View style={styles.container}>
        <StatusBar backgroundColor="transparent" barStyle="dark-content" />
        <OnBoarding />
        <View style={styles.footer}>
          <TouchableOpacity style={styles.fbButton} onPress={loginWithFacebook}>
            <Ionicons name="logo-facebook" size={30} color="#fff" />
            <Text style={styles.fbText}>Sign up with Facebook</Text>
          </TouchableOpacity>
          {Platform.OS === 'ios' ? (
            <TouchableOpacity
              style={styles.appleButton}
              onPress={loginWithApple}
            >
              <Ionicons name="logo-apple" size={30} color="#fff" />
              <Text style={styles.fbText}>Sign up with Apple</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity style={styles.usernameButton} onPress={goToSignUp}>
            <Ionicons name={`${PRE_ICON}-contact`} size={30} color="#7C4DFF" />
            <Text style={styles.usernameText}>Sign up with username</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton} onPress={goToLogin}>
            <Text style={styles.loginText}>
              Already have an account?{' '}
              <Text style={{ color: '#7C4DFF' }}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export const facebookAuth = async () => {
  await Facebook.initializeAsync('2531655210451972');
  const { type, token } = await Facebook.logInWithReadPermissionsAsync({
    permissions: ['public_profile', 'user_friends']
  });
  if (type === 'success') {
    const response = await fetch(
      `https://graph.facebook.com/me?access_token=${token}`
    );
    const friendsResponse = await fetch(
      `https://graph.facebook.com/me/friends?access_token=${token}`
    );

    const friends = await friendsResponse.json();
    const user = await response.json();

    return { ...user, friends: friends.data };
  }
};

export const appleAuth = async () => {
  const credentials = await signInAsync({
    requestedScopes: [
      AppleAuthenticationScope.FULL_NAME,
      AppleAuthenticationScope.EMAIL
    ]
  });

  return { appleID: credentials.email, name: credentials.fullName.givenName };
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#FCFCFE',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  footer: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: 24
  },
  fbButton: {
    alignItems: 'center',
    backgroundColor: '#3B5998',
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Platform.OS === 'ios' ? 12 : 24,
    paddingHorizontal: 8,
    paddingVertical: 6,
    width: Layout.window.width - 48
  },
  fbText: {
    color: '#fff',
    fontFamily: 'sf-medium',
    fontSize: 16,
    marginLeft: 12
  },
  appleButton: {
    alignItems: 'center',
    backgroundColor: '#2f2f2f',
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
    width: Layout.window.width - 48
  },
  appleText: {
    color: '#fff',
    fontFamily: 'sf-medium',
    fontSize: 16,
    marginLeft: 12
  },
  usernameButton: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7C4DFF',
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Platform.OS === 'ios' ? 12 : 24,
    paddingHorizontal: 8,
    paddingVertical: 6,
    width: Layout.window.width - 48
  },
  usernameText: {
    color: '#7C4DFF',
    fontFamily: 'sf-medium',
    fontSize: 16,
    marginLeft: 12,
    textAlign: 'center'
  },
  loginButton: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    width: Layout.window.width - 48
  },
  loginText: {
    fontFamily: 'sf-medium'
  }
});

AuthScreen.propTypes = {
  navigation: object.isRequired,
  showPickUsername: func.isRequired
};

export default connect(
  null,
  mapDispatchToProps
)(AuthScreen);
