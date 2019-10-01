import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Video } from 'expo-av';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { func, number, string } from 'prop-types';

const { front } = Camera.Constants.Type;

const VideoOverlay = ({ uri, cameraType, setState }) => {
  const handleClose = () => setState({ videoUri: null });

  return (
    <View style={styles.container}>
      <View style={styles.topControls}>
        <TouchableOpacity style={styles.close} onPress={handleClose}>
          <Ionicons color="#fff" size={30} name="md-close" />
        </TouchableOpacity>
      </View>
      <LinearGradient
        style={styles.gradient}
        colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
        pointerEvents="none"
      />
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
};

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
    top: 0,
    zIndex: -1
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
  setState: func.isRequired,
  cameraType: number.isRequired
};

export default VideoOverlay;
