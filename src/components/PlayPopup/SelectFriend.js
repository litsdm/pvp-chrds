import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Layout from '../../constants/Layout';

const SelectFriend = ({ handleDone }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Select an opponent</Text>
    <TouchableOpacity style={styles.button} onPress={handleDone}>
      <Text style={styles.buttonText}>Play</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: Layout.window.width
  },
  title: {
    fontFamily: 'sf-bold',
    fontSize: 24,
    marginVertical: 24
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'rgba(124,77,255, 0.2)',
    borderRadius: 8,
    justifyContent: 'center',
    marginVertical: 24,
    paddingVertical: 6,
    width: '50%'
  },
  buttonText: {
    color: '#7c4dff',
    fontFamily: 'sf-bold',
    fontSize: 22
  }
});

export default SelectFriend;
