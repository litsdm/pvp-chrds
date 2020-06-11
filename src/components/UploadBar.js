import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { func, object, string } from 'prop-types';

const UploadBar = ({ close, videos, message }) => {
  const calculateTotalProgress = () => {
    let totalProgress = 0;
    const fileValues = Object.values(videos);

    if (!fileValues || fileValues.length <= 0) return 0;

    fileValues.forEach(({ progress }) => {
      totalProgress += progress;
    });

    return Math.round((totalProgress / fileValues.length) * 100);
  };

  const videoCount = Object.keys(videos).length;
  const totalProgress = calculateTotalProgress();

  useEffect(() => {
    if (totalProgress === 100) close();
  }, [totalProgress]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {message ||
            `Uploading ${videoCount} ${videoCount > 1 ? 'videos' : 'video'}`}
        </Text>
        {!message ? (
          <Text style={styles.subtitle}>{totalProgress}%</Text>
        ) : null}
        <View style={[styles.progressWrapper, { width: `${totalProgress}%` }]}>
          <View style={styles.progressLine} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    bottom: 52,
    height: 72,
    justifyContent: 'center',
    left: 0,
    opacity: 0.98,
    position: 'absolute',
    right: 0,
    width: '100%',
    zIndex: 96
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    height: 56,
    justifyContent: 'center',
    width: '85%'
  },
  progressWrapper: {
    backgroundColor: 'rgba(0,0,0,0.04)',
    bottom: 0,
    borderRadius: 8,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  },
  progressLine: {
    backgroundColor: '#7c4dff',
    bottom: 6,
    height: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 5
  },
  title: {
    fontSize: 12,
    fontFamily: 'sf-medium',
    marginLeft: 24
  },
  subtitle: {
    color: '#999',
    fontSize: 10,
    fontFamily: 'sf-regular',
    marginLeft: 24
  }
});

UploadBar.propTypes = {
  close: func.isRequired,
  videos: object,
  message: string
};

UploadBar.defaultProps = {
  videos: {},
  message: ''
};

export default UploadBar;
