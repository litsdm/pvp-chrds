import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Ionicons } from '@expo/vector-icons';
import { object } from 'prop-types';

import OnBoarding from '../components/Auth/OnBoarding';

import Layout from '../constants/Layout';

const PRE_ICON = Platform.OS === 'ios' ? 'ios' : 'md';

const AuthScreen = ({ navigation }) => {
  const goToSignUp = () => navigation.navigate('AuthEmail', { isNew: true });
  const goToLogin = () => navigation.navigate('AuthEmail', { isNew: false });

  return (
    <View style={styles.container}>
      <OnBoarding />
      <View style={styles.footer}>
        <TouchableOpacity style={styles.fbButton}>
          <Ionicons name="logo-facebook" size={30} color="#fff" />
          <Text style={styles.fbText}>Sign up with Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.emailButton} onPress={goToSignUp}>
          <Ionicons name={`${PRE_ICON}-mail`} size={30} color="#7C4DFF" />
          <Text style={styles.emailText}>Sign up with email</Text>
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

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#FCFCFE',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: getStatusBarHeight()
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
    marginBottom: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
    width: Layout.window.width - 48
  },
  fbText: {
    color: '#fff',
    fontFamily: 'sf-medium',
    fontSize: 22,
    marginLeft: 12
  },
  emailButton: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7C4DFF',
    borderRadius: 6,
    flexDirection: 'row',
    marginBottom: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
    width: Layout.window.width - 48
  },
  emailText: {
    color: '#7C4DFF',
    fontFamily: 'sf-medium',
    fontSize: 22,
    marginLeft: 12,
    textAlign: 'center',
    flexBasis: '75%'
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
