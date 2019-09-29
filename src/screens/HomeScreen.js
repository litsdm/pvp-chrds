import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { object } from 'prop-types';

const HomeScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Text>This is home</Text>
    <TouchableOpacity onPress={() => navigation.navigate('Camera')}>
      <Text>Go to Camera</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingTop: getStatusBarHeight()
  }
});

HomeScreen.propTypes = {
  navigation: object.isRequired
};

export default HomeScreen;
