import React, { useState } from 'react';
import {
  AsyncStorage,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { func, object } from 'prop-types';
import callApi from '../helpers/apiCaller';

import { toggleBadge } from '../actions/popup';

import Login from '../components/Auth/Login';
import Signup from '../components/Auth/Signup';
import AnimatedCircle from '../components/AnimatedCircle';

const mapDispatchToProps = dispatch => ({
  displayBadge: message => dispatch(toggleBadge(true, message, 'error'))
});

const AuthEmailScreen = ({ navigation, displayBadge }) => {
  const isNewParam = JSON.stringify(navigation.getParam('isNew', true));
  const [isNew, setNew] = useState(isNewParam === 'true');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authorizing, setAuthorizing] = useState(false);

  const toggleScreen = () => setNew(!isNew);

  const setState = (property, value) => {
    switch (property) {
      case 'username':
        return setUsername(value);
      case 'email':
        return setEmail(value);
      case 'password':
        return setPassword(value);
      default:
        break;
    }
  };

  const callLogin = async () => {
    try {
      const payload = {
        email,
        password
      };
      const response = await callApi('login', payload, 'POST');
      const { token, message } = await response.json();

      if (message) throw new Error(message);

      return token;
    } catch (exception) {
      throw new Error(exception.message);
    }
  };

  const callSignup = async () => {
    try {
      const payload = {
        email,
        password,
        username
      };

      const response = await callApi('signup', payload, 'POST');
      const { token, message } = await response.json();

      if (message) throw new Error(message);

      return token;
    } catch (exception) {
      console.log(`[callSignup] ${exception.message}`);
      throw new Error(exception.message);
    }
  };

  const validateEmail = emailStr => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(emailStr).toLowerCase());
  };

  const validate = () => {
    let errorMessage = '';

    if (email === '') errorMessage = 'Please enter your email.';
    if (password === '') errorMessage = 'Please enter your password.';

    if (username === '' && isNew) errorMessage = 'Please enter your username.';
    if (!validateEmail(email) && isNew) errorMessage = 'Email is invalid.';
    if (password.length < 3 && isNew)
      errorMessage = 'Password must be at least 3 characters long.';

    return errorMessage;
  };

  const authorize = async () => {
    try {
      const errorMessage = validate();
      let token;

      Keyboard.dismiss();
      if (errorMessage) {
        displayBadge(errorMessage);
        return;
      }

      setAuthorizing(true);

      if (isNew) token = await callSignup();
      else token = await callLogin();

      await AsyncStorage.setItem('CHRDS_TOKEN', token);
      navigation.navigate('Main');
    } catch (exception) {
      setAuthorizing(false);
      displayBadge(exception.message);
      console.log(exception.message);
    }
  };

  return (
    <ScrollView>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <AnimatedCircle
          color="#7C4DFF"
          size={152}
          animationType="position"
          endPosition={{ y: 152, x: 152 - 152 / 3 }}
          circleStyle={{ left: -152, top: -152 }}
        />
        <AnimatedCircle
          color="#FF5252"
          size={132}
          animationType="position"
          endPosition={{ y: 132 - 132 / 3, x: 132 + 24 }}
          circleStyle={{ left: -132, top: -132 }}
          delay={100}
        />
        <AnimatedCircle
          color="#FFC107"
          size={132}
          animationType="position"
          endPosition={{ y: 132 - 132 / 4, x: 132 - 132 / 4 }}
          circleStyle={{ left: -132, top: -132 }}
          delay={200}
        />
        <AnimatedCircle
          color="#2196F3"
          size={120}
          animationType="position"
          endPosition={{ y: 180, x: -120 + 120 / 1.7 }}
          circleStyle={{ right: -120, top: -120 }}
          delay={300}
          empty
        />
        {isNew ? (
          <Signup
            goToLogin={toggleScreen}
            setState={setState}
            username={username}
            email={email}
            password={password}
            authorize={authorize}
            authorizing={authorizing}
          />
        ) : (
          <Login
            goToSignup={toggleScreen}
            setState={setState}
            email={email}
            password={password}
            authorize={authorize}
            authorizing={authorizing}
          />
        )}
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#FCFCFE',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: getStatusBarHeight() + 48
  }
});

AuthEmailScreen.propTypes = {
  navigation: object.isRequired,
  displayBadge: func.isRequired
};

export default connect(
  null,
  mapDispatchToProps
)(AuthEmailScreen);
