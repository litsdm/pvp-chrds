import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Video } from 'expo-av';
import { Camera } from 'expo-camera';
import { arrayOf, node, number, oneOfType, string } from 'prop-types';

const { front } = Camera.Constants.Type;

const VideoOverlay = ({ uri, cameraType, children }) => (
  <View style={styles.container}>
    {children}
    <Video
      source={{ uri, androidImplementation: 'MediaPlayer' }}
      isLooping
      shouldPlay
      resizeMode="cover"
      style={[
        styles.video,
        cameraType === front ? { transform: [{ scaleX: -1 }] } : {}
      ]}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 5
  },
  topControls: {
    alignItems: 'center',
    flexDirection: 'row',
    left: 0,
    justifyContent: 'flex-start',
    padding: 24,
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
  video: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: -1
  }
});

VideoOverlay.propTypes = {
  uri: string.isRequired,
  cameraType: number.isRequired,
  children: oneOfType([arrayOf(node), node]).isRequired
};

export default VideoOverlay;
