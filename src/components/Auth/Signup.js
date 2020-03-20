import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { bool, func, string } from 'prop-types';

import Layout from '../../constants/Layout';

import Input from './Input';

const Signup = ({
  goToLogin,
  setState,
  username,
  password,
  authorize,
  authorizing,
  handleFB,
  handleApple,
  handleTerms
}) => (
  <>
    <View style={styles.logoWrapper}>
      <Image
        source={{
          uri:
            'https://chrds-static.s3-us-west-2.amazonaws.com/logo-charades-512-min.png?rand=123'
        }}
        style={styles.logo}
      />
    </View>
    <Text style={styles.title}>Sign Up with Username</Text>
    <View style={styles.content}>
      <Input
        onChangeText={text => setState('username', text)}
        value={username}
        label="Username"
        iconName="contact"
      />
      <Input
        onChangeText={text => setState('password', text)}
        secureTextEntry
        value={password}
        label="Password"
        iconName="key"
      />
    </View>
    <View style={styles.footer}>
      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          By pressing Sign Up you agree to our{' '}
        </Text>
        <TouchableOpacity onPress={handleTerms}>
          <Text style={styles.discBtnText}>Terms & Conditions</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.signupButton}
        onPress={authorize}
        disabled={authorizing}
      >
        <Text style={styles.signupText}>
          {authorizing ? 'Authorizing...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.switchButton} onPress={goToLogin}>
        <Text styles={styles.switchText}>
          Already have an account?{' '}
          <Text style={{ color: '#7C4DFF' }}>Login</Text>
        </Text>
      </TouchableOpacity>
      <View style={styles.dividerWrapper}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.line} />
      </View>
      {Platform.OS === 'ios' ? (
        <View style={styles.appleFooter}>
          <TouchableOpacity style={styles.fbSmall} onPress={handleFB}>
            <Ionicons name="logo-facebook" size={36} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.appleSmall} onPress={handleApple}>
            <Ionicons name="logo-apple" size={36} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.fbButton} onPress={handleFB}>
          <Ionicons name="logo-facebook" size={30} color="#fff" />
          <Text style={styles.fbText}>Log in with Facebook</Text>
        </TouchableOpacity>
      )}
    </View>
  </>
);

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  title: {
    fontFamily: 'sf-bold',
    fontSize: 24,
    marginTop: 24,
    marginBottom: 24,
    textAlign: 'center'
  },
  footer: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: 24
  },
  signupButton: {
    alignItems: 'center',
    backgroundColor: '#7C4DFF',
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    paddingVertical: 6,
    width: Layout.window.width - 48
  },
  signupText: {
    color: '#fff',
    fontFamily: 'sf-medium',
    fontSize: 20
  },
  switchButton: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    width: Layout.window.width - 48
  },
  switchText: {
    fontFamily: 'sf-medium'
  },
  dividerWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 24
  },
  line: {
    backgroundColor: 'rgba(0 ,0, 0, 0.1)',
    height: 1,
    width: '45%'
  },
  dividerText: {
    fontFamily: 'sf-bold',
    color: 'rgba(0, 0, 0, 0.3)'
  },
  fbButton: {
    alignItems: 'center',
    backgroundColor: '#3B5998',
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    width: Layout.window.width - 48
  },
  fbText: {
    color: '#fff',
    fontFamily: 'sf-medium',
    fontSize: 16,
    marginLeft: 12
  },
  logoWrapper: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    height: 112,
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: 112
  },
  logo: {
    borderRadius: 12,
    height: 88,
    width: 88
  },
  appleFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  fbSmall: {
    alignItems: 'center',
    backgroundColor: '#3B5998',
    borderRadius: 8,
    height: 54,
    justifyContent: 'center',
    marginRight: 24,
    width: 54
  },
  appleSmall: {
    alignItems: 'center',
    backgroundColor: '#2f2f2f',
    borderRadius: 8,
    height: 54,
    justifyContent: 'center',
    marginRight: 12,
    width: 54
  },
  disclaimer: {
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 12
  },
  disclaimerText: {
    fontFamily: 'sf-regular',
    fontSize: 10,
    opacity: 0.5
  },
  discBtnText: {
    color: '#2196F3',
    fontFamily: 'sf-medium',
    fontSize: 10
  }
});

Signup.propTypes = {
  goToLogin: func.isRequired,
  setState: func.isRequired,
  username: string.isRequired,
  password: string.isRequired,
  authorize: func.isRequired,
  authorizing: bool.isRequired,
  handleFB: func.isRequired,
  handleApple: func.isRequired,
  handleTerms: func.isRequired
};

export default Signup;
