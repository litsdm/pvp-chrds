import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useLazyQuery } from '@apollo/react-hooks';
import jwtDecode from 'jwt-decode';
import { object } from 'prop-types';

import GET_USER from '../graphql/queries/getUser';

const AuthLoadingScreen = ({ navigation }) => {
  const [getUser] = useLazyQuery(GET_USER);
  useEffect(() => {
    checkUserToken();
  }, []);

  const checkUserToken = async () => {
    const token = await AsyncStorage.getItem('CHRDS_TOKEN');
    let _id = '';

    if (token) {
      const { _id: id } = jwtDecode(token);
      _id = id;
      getUser({ variables: { _id } });
    }

    navigation.navigate(token ? 'Home' : 'Auth', { userID: _id });
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  }
});

AuthLoadingScreen.propTypes = {
  navigation: object.isRequired
};

export default AuthLoadingScreen;
