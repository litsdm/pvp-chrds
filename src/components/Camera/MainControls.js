import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Camera } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { number, func } from 'prop-types';

const PRE_ICON = Platform.OS === 'ios' ? 'ios' : 'md';
const { front: frontType, back: backType } = Camera.Constants.Type;
const { on: flashOn, off: flashOff } = Camera.Constants.FlashMode;

const MainControls = ({ flash, cameraType, setState }) => {
  const handleFlash = () =>
    setState({ flash: flash === flashOn ? flashOff : flashOn });
  const handleReverseCamera = () =>
    setState({ cameraType: cameraType === frontType ? backType : frontType });

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.sideButton} onPress={handleFlash}>
          <Ionicons
            color="#fff"
            size={30}
            style={{ opacity: flash === flashOn ? 1 : 0.7 }}
            name={`${PRE_ICON}-${flash === flashOn ? 'flash' : 'flash-off'}`}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.mainButton}>
          <View style={styles.innerCircle} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sideButton}
          onPress={handleReverseCamera}
        >
          <Ionicons color="#fff" size={30} name={`${PRE_ICON}-repeat`} />
        </TouchableOpacity>
      </View>
      <LinearGradient
        style={styles.gradient}
        colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
        pointerEvents="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    bottom: 0,
    height: '50%',
    justifyContent: 'flex-end',
    left: 0,
    position: 'absolute',
    right: 0
  },
  gradient: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: -1
  },
  controls: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 36,
    zIndex: 3
  },
  mainButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 42,
    height: 84,
    justifyContent: 'center',
    width: 84
  },
  innerCircle: {
    backgroundColor: '#fff',
    borderRadius: 27,
    height: 54,
    width: 54
  }
});

MainControls.propTypes = {
  flash: number.isRequired,
  cameraType: number.isRequired,
  setState: func.isRequired
};

export default MainControls;
