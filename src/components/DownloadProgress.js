import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { number } from 'prop-types';

const DownloadProgress = ({ progress }) => (
  <View style={styles.container}>
    <View style={styles.overlay} />
    <View style={styles.content}>
      <View style={styles.progressContainer}>
        <AnimatedCircularProgress
          size={60}
          width={4}
          fill={Math.round(progress * 100)}
          rotation={0}
          lineCap="round"
          tintColor="#fff"
          backgroundColor="transparent"
        />
        <Text style={styles.progress}>{Math.round(progress * 100)}%</Text>
      </View>
      <Text style={styles.text}>Saving</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 11
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: -1
  },
  content: {
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#333',
    height: 132,
    justifyContent: 'center',
    width: 132
  },
  progressContainer: {
    alignItems: 'center',
    height: 60,
    justifyContent: 'center',
    width: 60
  },
  progress: {
    color: '#fff',
    fontFamily: 'sf-medium',
    position: 'absolute'
  },
  text: {
    color: '#fff',
    fontFamily: 'sf-light',
    marginTop: 12
  }
});

DownloadProgress.propTypes = {
  progress: number.isRequired
};

export default DownloadProgress;
