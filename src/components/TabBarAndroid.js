import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { func, object } from 'prop-types';

import Tab from './TabAndroid';

const TabBar = ({ renderIcon, navigation, onTabPress }) => {
  const { routes, index } = navigation.state;

  return (
    <View style={styles.container}>
      <Tab
        renderIcon={renderIcon}
        route={routes[0]}
        isActive={index === 0}
        onTabPress={onTabPress}
      />
      <TouchableOpacity style={styles.play}>
        <Ionicons name="logo-game-controller-b" size={26} color="#999" />
      </TouchableOpacity>
      <Tab
        renderIcon={renderIcon}
        route={routes[1]}
        isActive={index === 1}
        onTabPress={onTabPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 52,
    justifyContent: 'space-around',
    paddingHorizontal: 12
  },
  play: {
    width: 36
  }
});

TabBar.propTypes = {
  onTabPress: func.isRequired,
  renderIcon: func.isRequired,
  navigation: object.isRequired
};

export default TabBar;
