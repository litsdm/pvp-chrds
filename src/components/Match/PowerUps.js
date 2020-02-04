import React from 'react';
import { StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';
import { func } from 'prop-types';

import PowerUp from './PowerUp';

const IS_IPHONE_X =
  Constants.deviceName.includes('iPhone X') ||
  Constants.deviceName.includes('iPhone 11');

const PowerUps = ({ onPress }) => {
  return (
    <View style={styles.container}>
      <PowerUp
        icon="bomb"
        text="Bomb - Blast unnecessary letters."
        onPress={onPress('bomb')}
      />
      <PowerUp
        icon="hourglass-half"
        text="Hourglass - Slower countdown."
        onPress={onPress('hourglass')}
      />
      <PowerUp
        icon="info-circle"
        onPress={onPress('hint')}
        text="Hint - Get a small but useful hint."
      />
      <PowerUp
        icon="fill-drip"
        text="Fill - 2 random letters."
        onPress={onPress('fill')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    position: 'absolute',
    right: 24,
    top: IS_IPHONE_X ? 72 + 44 : 72,
    zIndex: 3
  }
});

PowerUps.propTypes = {
  onPress: func.isRequired
};

export default PowerUps;
