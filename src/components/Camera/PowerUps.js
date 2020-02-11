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
        icon="microphone-alt"
        text="Mic - Record your video w/ sound."
        onPress={onPress('mic')}
      />
      <PowerUp
        icon="hand-pointer"
        text="Hand - Select the word you want."
        onPress={onPress('hand')}
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
