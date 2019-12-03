import React from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Camera } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { bool, func, number, object } from 'prop-types';

import WordTooltip from './WordTooltip';
import CircularProgress from './CircularProgress';

import cameraAnimation from '../../../assets/animations/selfieSwitch.json';
import flashAnimation from '../../../assets/animations/flashSwitch.json';

const PRE_ICON = Platform.OS === 'ios' ? 'ios' : 'md';
const { front: frontType, back: backType } = Camera.Constants.Type;
const { on: flashOn, off: flashOff } = Camera.Constants.FlashMode;

const MainControls = ({
  flash,
  cameraType,
  recordVideo,
  isRecording,
  cameraAnimationRef,
  flashAnimationRef,
  animationValue,
  setState,
  word
}) => {
  const handleFlash = () =>
    setState({ flash: flash === flashOn ? flashOff : flashOn });
  const handleReverseCamera = () =>
    setState({ cameraType: cameraType === frontType ? backType : frontType });

  const animateOuter = {
    transform: [
      {
        scale: animationValue.current.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.15]
        })
      }
    ]
  };

  const animateInner = {
    transform: [
      {
        scale: animationValue.current.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.75]
        })
      }
    ]
  };

  const animateOpacity = {
    opacity: animationValue.current.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0]
    })
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {!isRecording ? <WordTooltip word={word} /> : null}
        <View style={styles.controls}>
          <Animated.View style={animateOpacity}>
            <TouchableWithoutFeedback
              onPress={handleFlash}
              disabled={isRecording}
            >
              <View style={styles.sideButton}>
                {Platform.OS === 'ios' ? (
                  <Ionicons
                    color="#fff"
                    size={30}
                    style={{ opacity: flash === flashOn ? 1 : 0.7 }}
                    name={`${PRE_ICON}-${
                      flash === flashOn ? 'flash' : 'flash-off'
                    }`}
                  />
                ) : (
                  <LottieView
                    source={flashAnimation}
                    ref={flashAnimationRef}
                    loop={false}
                    style={styles.flashAnimation}
                    resizeMode="cover"
                  />
                )}
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
          <TouchableWithoutFeedback
            onPress={recordVideo}
            disabled={isRecording}
          >
            <Animated.View style={[styles.mainButton, animateOuter]}>
              <Animated.View
                style={[
                  styles.innerCircle,
                  isRecording ? styles.innerRec : {},
                  animateInner
                ]}
              />
              {isRecording ? <CircularProgress /> : null}
            </Animated.View>
          </TouchableWithoutFeedback>
          <Animated.View style={animateOpacity}>
            <TouchableWithoutFeedback
              onPress={handleReverseCamera}
              disabled={isRecording}
            >
              <View style={styles.sideButton}>
                <LottieView
                  source={cameraAnimation}
                  ref={cameraAnimationRef}
                  loop={false}
                  style={styles.cameraAnimation}
                />
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </View>
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
  content: {
    zIndex: 3
  },
  controls: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 36,
    marginTop: 12
  },
  mainButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 42,
    height: 84,
    justifyContent: 'center',
    marginLeft: 48,
    marginRight: 48,
    width: 84
  },
  mainRec: {
    borderRadius: 48,
    height: 96,
    width: 96
  },
  innerCircle: {
    backgroundColor: '#fff',
    borderRadius: 27,
    height: 54,
    width: 54
  },
  innerRec: {
    backgroundColor: '#FF5252'
  },
  cameraAnimation: {
    height: 124,
    position: 'absolute'
  },
  flashAnimation: {
    height: 148
  },
  sideButton: {
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
    width: 48
  }
});

MainControls.propTypes = {
  flash: number.isRequired,
  cameraType: number.isRequired,
  setState: func.isRequired,
  isRecording: bool.isRequired,
  recordVideo: func.isRequired,
  animationValue: object.isRequired,
  cameraAnimationRef: object.isRequired,
  flashAnimationRef: object.isRequired
};

export default MainControls;
