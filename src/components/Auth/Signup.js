import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
  authorizing
}) => (
  <>
    <View style={styles.logoWrapper}>
      <Image
        source={{
          uri:
            'https://feather-static.s3-us-west-2.amazonaws.com/chrds-logo-bg.jpeg'
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
      <TouchableOpacity style={styles.fbButton}>
        <Ionicons name="logo-facebook" size={30} color="#fff" />
        <Text style={styles.fbText}>Sign up with Facebook</Text>
      </TouchableOpacity>
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
  }
});

Signup.propTypes = {
  goToLogin: func.isRequired,
  setState: func.isRequired,
  username: string.isRequired,
  password: string.isRequired,
  authorize: func.isRequired,
  authorizing: bool.isRequired
};

export default Signup;
