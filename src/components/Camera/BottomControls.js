import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { func } from 'prop-types';

import VideoButton from '../VideoButton';

const BottomControls = ({ send, openShare }) => (
  <View style={styles.container}>
    <LinearGradient
      style={styles.gradient}
      colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
      pointerEvents="none"
    />
    <View style={styles.bottom}>
      <TouchableOpacity onPress={openShare}>
        <FontAwesome5 name="share" color="#fff" size={30} />
      </TouchableOpacity>
      <VideoButton onPress={send} text="Send" iconName="paper-plane" />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    bottom: 0,
    flexDirection: 'row',
    height: '50%',
    justifyContent: 'flex-end',
    left: 0,
    paddingHorizontal: 24,
    paddingBottom: 24,
    position: 'absolute',
    right: 0
  },
  gradient: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  },
  send: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 6
  },
  sendText: {
    color: '#7c4dff',
    fontFamily: 'sf-medium',
    fontSize: 16,
    marginRight: 6
  },
  bottom: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  }
});

BottomControls.propTypes = {
  send: func.isRequired,
  openShare: func.isRequired
};

export default BottomControls;
