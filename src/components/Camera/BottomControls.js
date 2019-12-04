import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const BottomControls = ({ send }) => (
  <View style={styles.container}>
    <LinearGradient
      style={styles.gradient}
      colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
      pointerEvents="none"
    />
    <View style={styles.bottom}>
      <TouchableOpacity style={styles.send} onPress={send}>
        <FontAwesome5 name="paper-plane" color="#fff" size={30} />
      </TouchableOpacity>
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
    height: 36,
    width: 36
  }
});

export default BottomControls;
