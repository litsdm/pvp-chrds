import React, { useState } from 'react';
import {
  AsyncStorage,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { func, object } from 'prop-types';

import callApi from '../helpers/apiCaller';
import { facebookAuth, appleAuth } from './AuthScreen';
import { toggleBadge, togglePickUsername } from '../actions/popup';

import Login from '../components/Auth/Login';
import Signup from '../components/Auth/Signup';
import AnimatedCircle from '../components/AnimatedCircle';

const mapDispatchToProps = dispatch => ({
  displayBadge: message => dispatch(toggleBadge(true, message, 'error')),
  showPickUsername: data => dispatch(togglePickUsername(true, data))
});

const AuthUsernameScreen = ({ navigation, displayBadge, showPickUsername }) => {
  const isNewParam = JSON.stringify(navigation.getParam('isNew', true));
  const [isNew, setNew] = useState(isNewParam === 'true');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authorizing, setAuthorizing] = useState(false);

  const toggleScreen = () => setNew(!isNew);

  const setState = (property, value) => {
    switch (property) {
      case 'username':
        return setUsername(value);
      case 'password':
        return setPassword(value);
      default:
        break;
    }
  };

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

  const callLogin = async () => {
    try {
      const payload = {
        displayName: username,
        username: username.toLowerCase(),
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
        password,
        displayName: username,
        username: username.toLowerCase()
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

  const validate = () => {
    let errorMessage = '';

    if (username === '') errorMessage = 'Please enter your username.';
    if (password === '') errorMessage = 'Please enter your password.';

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

      handleSuccess(token);
    } catch (exception) {
      setAuthorizing(false);
      displayBadge(exception.message);
      console.log(exception.message);
    }
  };

  return (
    <>
      <StatusBar backgroundColor="transparent" barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
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
              password={password}
              authorize={authorize}
              authorizing={authorizing}
              handleFB={loginWithFacebook}
              handleApple={loginWithApple}
            />
          ) : (
            <Login
              goToSignup={toggleScreen}
              setState={setState}
              username={username}
              password={password}
              authorize={authorize}
              authorizing={authorizing}
              handleFB={loginWithFacebook}
              handleApple={loginWithApple}
            />
          )}
        </KeyboardAvoidingView>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#FCFCFE',
    flex: 1,
    justifyContent: 'center',
    paddingTop: 48
  }
});

AuthUsernameScreen.propTypes = {
  navigation: object.isRequired,
  displayBadge: func.isRequired,
  showPickUsername: func.isRequired
};

export default connect(
  null,
  mapDispatchToProps
)(AuthUsernameScreen);
