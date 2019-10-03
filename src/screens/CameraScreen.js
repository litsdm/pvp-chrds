import React, { useEffect, useState, useRef } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import * as Brightness from 'expo-brightness';
import { object } from 'prop-types';

import { useAnimation } from '../helpers/hooks';

import MainControls from '../components/Camera/MainControls';
import VideoOverlay from '../components/Camera/VideoOverlay';
import CountdownPopup from '../components/Camera/CountdownPopup';

const { front: frontType } = Camera.Constants.Type;
const { off: flashOff, on: flashOn, torch } = Camera.Constants.FlashMode;

let originalBrightness;

const CameraScreen = ({ navigation }) => {
  const [hasPermissions, setPermissions] = useState(false);
  const [cameraType, setCameraType] = useState(frontType);
  const [flash, setFlash] = useState(flashOff);
  const [isRecording, setRecording] = useState(false);
  const [isCounting, setCounting] = useState(false);
  const [videoUri, setVideoUri] = useState('');
  const [videos, setVideos] = useState([]);
  const { animationValue, animateTo } = useAnimation({ duration: 200 });

  const camera = useRef(null);
  const cameraAnimation = useRef(null);
  const flashAnimation = useRef(null);

  useEffect(() => {
    checkPermissions();
    setBrightness(true);
  }, []);

  useEffect(() => {
    if (isRecording) animateTo(1);
    else animateTo(0);

    setBrightness();
  }, [isRecording]);

  const setState = newState =>
    Object.keys(newState).forEach(property => {
      const value = newState[property];
      switch (property) {
        case 'flash':
          if (value !== flashOff && flashAnimation.current)
            flashAnimation.current.play(60, 116);
          else if (value === flashOff && flashAnimation.current)
            flashAnimation.current.play(150, 204);
          return setFlash(value);
        case 'cameraType':
          if (value !== frontType && cameraAnimation.current)
            cameraAnimation.current.play(60, 72);
          else if (value === frontType && cameraAnimation.current)
            cameraAnimation.current.play(134, 150);
          return setCameraType(value);
        case 'isRecording':
          return setRecording(value);
        case 'videoUri':
          return setVideoUri(value);
        case 'isCounting':
          return setCounting(value);
        default:
          break;
      }
    });

  const setBrightness = async (original = false) => {
    const currentBrightness = await Brightness.getSystemBrightnessAsync();
    if (original) {
      originalBrightness = currentBrightness;
      return;
    }

    if (isRecording && cameraType === frontType && flash === flashOn)
      await Brightness.setSystemBrightnessAsync(1);
    else if (!isRecording && currentBrightness === 1) {
      await Brightness.setSystemBrightnessAsync(originalBrightness);
    }
  };

  const handleCountdownEnd = () => {
    setState({ isRecording: true, isCounting: false });
    recordVideo();
  };

  const checkPermissions = async () => {
    const { CAMERA, AUDIO_RECORDING, SYSTEM_BRIGHTNESS } = Permissions;
    const { status } = await Permissions.askAsync(
      CAMERA,
      AUDIO_RECORDING,
      SYSTEM_BRIGHTNESS
    );

    if (status !== 'granted') navigation.goBack();
    else setPermissions(true);
  };

  const recordVideo = async () => {
    if (camera.current === null) return;
    setRecording(true);
    const { uri } = await camera.current.recordAsync({
      maxDuration: 5,
      mute: true
    });
    setState({ isRecording: false, videoUri: uri });
  };

  const waitForCountdown = () => setCounting(true);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      {hasPermissions ? (
        <Camera
          style={{ flex: 1 }}
          type={cameraType}
          flashMode={isRecording && flash === flashOn ? torch : flashOff}
          ratio="16:9"
          ref={camera}
        >
          <MainControls
            flash={flash}
            cameraType={cameraType}
            recordVideo={waitForCountdown}
            setState={setState}
            isRecording={isRecording}
            cameraAnimationRef={cameraAnimation}
            flashAnimationRef={flashAnimation}
            animationValue={animationValue}
          />
        </Camera>
      ) : (
        <Text>Doesnt have permissions screen</Text>
      )}
      {videoUri ? (
        <VideoOverlay
          uri={videoUri}
          setState={setState}
          cameraType={cameraType}
        />
      ) : null}
      {isCounting ? <CountdownPopup onEnd={handleCountdownEnd} /> : null}
      {isRecording && cameraType === frontType && flash === flashOn ? (
        <View style={styles.frontFlash} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1
  },
  frontFlash: {
    backgroundColor: '#fff',
    bottom: 0,
    left: 0,
    opacity: 0.9,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 10
  }
});

CameraScreen.propTypes = {
  navigation: object.isRequired
};

export default CameraScreen;
