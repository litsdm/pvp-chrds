import React from 'react';
import { StyleSheet, View } from 'react-native';
import { getDeviceId } from 'react-native-device-info';
import { func } from 'prop-types';

import PowerUp from '../Match/PowerUp';

const deviceID = getDeviceId();

const IS_IPHONE_X =
  deviceID.includes('iPhone12') || deviceID.includes('iPhone11');

const PowerUps = ({ onPress }) => {
  return (
    <View style={styles.container}>
      <PowerUp
        icon="bomb"
        text="Bomb - Blast unnecessary letters."
        onPress={onPress('bomb')}
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
