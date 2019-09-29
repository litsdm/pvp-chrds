import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { object } from 'prop-types';

import MainControls from '../components/Camera/MainControls';

const { front: frontType } = Camera.Constants.Type;
const { off: flashOff } = Camera.Constants.FlashMode;

const CameraScreen = ({ navigation }) => {
  const [hasPermissions, setPermissions] = useState(false);
  const [cameraType, setCameraType] = useState(frontType);
  const [flash, setFlash] = useState(flashOff);

  useEffect(() => {
    checkPermissions();
  }, []);

  const setState = newState =>
    Object.keys(newState).forEach(property => {
      const value = newState[property];
      switch (property) {
        case 'flash':
          return setFlash(value);
        case 'cameraType':
          return setCameraType(value);
        default:
          break;
      }
    });

  const checkPermissions = async () => {
    const { CAMERA, AUDIO_RECORDING } = Permissions;
    const { status } = await Permissions.askAsync(CAMERA, AUDIO_RECORDING);

    if (status !== 'granted') navigation.goBack();
    else setPermissions(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      {hasPermissions ? (
        <Camera style={{ flex: 1 }} type={cameraType} ratio="16:9">
          <MainControls
            flash={flash}
            cameraType={cameraType}
            setState={setState}
          />
        </Camera>
      ) : (
        <Text>Doesnt have permissions screen</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1
  }
});

CameraScreen.propTypes = {
  navigation: object.isRequired
};

export default CameraScreen;
