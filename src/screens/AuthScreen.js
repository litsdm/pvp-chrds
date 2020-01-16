import React from 'react';
import {
  AsyncStorage,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Facebook from 'expo-facebook';
import { object } from 'prop-types';

import callApi from '../helpers/apiCaller';

import OnBoarding from '../components/Auth/OnBoarding';

import Layout from '../constants/Layout';

const PRE_ICON = Platform.OS === 'ios' ? 'ios' : 'md';

const AuthScreen = ({ navigation }) => {
  const goToSignUp = () => navigation.navigate('AuthEmail', { isNew: true });
  const goToLogin = () => navigation.navigate('AuthEmail', { isNew: false });

  const loginWithFacebook = async () => {
    const user = await facebookAuth();
    const response = await callApi('facebook', { user }, 'POST');
    const { token } = await response.json();

    await AsyncStorage.setItem('CHRDS_TOKEN', token);
    navigation.navigate('Main');
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="transparent" barStyle="dark-content" />
      <OnBoarding />
      <View style={styles.footer}>
        <TouchableOpacity style={styles.fbButton} onPress={loginWithFacebook}>
          <Ionicons name="logo-facebook" size={30} color="#fff" />
          <Text style={styles.fbText}>Sign up with Facebook</Text>
        </TouchableOpacity>
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
  );
};

export const facebookAuth = async () => {
  try {
    await Facebook.initializeAsync('2531655210451972');
    const {
      type,
      token,
      permissions,
      declinedPermissions
    } = await Facebook.logInWithReadPermissionsAsync({
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
  } catch (exception) {
    console.log(exception.message);
  }
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
    marginBottom: 24,
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
  usernameButton: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7C4DFF',
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
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
  navigation: object.isRequired
};

export default AuthScreen;
