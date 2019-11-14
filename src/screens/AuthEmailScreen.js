import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { object } from 'prop-types';

import Login from '../components/Auth/Login';
import Signup from '../components/Auth/Signup';
import AnimatedCircle from '../components/AnimatedCircle';

const AuthEmailScreen = ({ navigation }) => {
  const isNewParam = JSON.stringify(navigation.getParam('isNew', true));
  const [isNew, setNew] = useState(isNewParam === 'true');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  return (
    <View style={styles.container}>
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
        />
      ) : (
        <Login
          goToSignup={toggleScreen}
          setState={setState}
          email={email}
          password={password}
        />
      )}
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
    paddingTop: getStatusBarHeight() + 48
  }
});

AuthEmailScreen.propTypes = {
  navigation: object.isRequired
};

export default AuthEmailScreen;
