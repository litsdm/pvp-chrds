import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { bool, func, string } from 'prop-types';

import Switch from './Switch';

const ToggleOption = ({ label, onPress, isActive }) => (
  <TouchableHighlight underlayColor="rgba(124,77,255,0.2)" onPress={onPress}>
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Switch isActive={isActive} />
    </View>
  </TouchableHighlight>
);

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.04)',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 48,
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 6,
    width: '100%'
  },
  label: {
    fontFamily: 'sf-medium',
    fontSize: 16
  }
});

ToggleOption.propTypes = {
  label: string.isRequired,
  onPress: func.isRequired,
  isActive: bool
};

ToggleOption.defaultProps = {
  isActive: false
};

export default ToggleOption;
