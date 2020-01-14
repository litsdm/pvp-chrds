import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { func, string } from 'prop-types';

const SettingsNavBar = ({ goBack, title }) => (
  <View style={styles.container}>
    <TouchableOpacity style={styles.button} onPress={goBack}>
      <Ionicons name="ios-arrow-round-back" color="#000" size={30} />
    </TouchableOpacity>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
    height: 54,
    justifyContent: 'flex-start',
    left: 0,
    paddingHorizontal: 24,
    position: 'absolute',
    right: 0,
    top: Platform.OS === 'ios' ? getStatusBarHeight() : 0,
    width: '100%'
  },
  button: {
    height: 30,
    marginRight: 12,
    width: 30
  },
  title: {
    fontFamily: 'sf-bold',
    fontSize: 18
  }
});

SettingsNavBar.propTypes = {
  goBack: func.isRequired,
  title: string.isRequired
};

export default SettingsNavBar;
