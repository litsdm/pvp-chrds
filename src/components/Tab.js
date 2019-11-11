import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { bool, func, object } from 'prop-types';

const Tab = ({ renderIcon, isActive, route, onTabPress }) => (
  <TouchableOpacity
    style={styles.container}
    onPress={() => onTabPress({ route })}
  >
    {renderIcon({ route, focused: isActive })}
    <Text style={[styles.text, isActive ? styles.txtActive : {}]}>
      {route.routeName}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  text: {
    color: '#000',
    fontFamily: 'sf-medium',
    fontSize: 10,
    opacity: 0.4
  },
  txtActive: {
    color: '#7C4DFF',
    opacity: 0.7
  }
});

Tab.propTypes = {
  isActive: bool.isRequired,
  onTabPress: func.isRequired,
  renderIcon: func.isRequired,
  route: object.isRequired
};

export default Tab;
