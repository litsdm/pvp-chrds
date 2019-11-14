import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StyleSheet,
  View
} from 'react-native';
import { useLazyQuery } from '@apollo/react-hooks';
import { object } from 'prop-types';

import GET_USER from '../graphql/queries/getUserFromToken';

const AuthLoadingScreen = ({ navigation }) => {
  const [getUser] = useLazyQuery(GET_USER);
  useEffect(() => {
    checkUserToken();
  }, []);

  const checkUserToken = async () => {
    const token = await AsyncStorage.getItem('CHRDS_TOKEN');
    if (token) getUser({ variables: { token } });
    navigation.navigate(token ? 'Main' : 'Auth');
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
