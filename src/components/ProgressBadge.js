import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { func, object } from 'prop-types';

import { useAnimation } from '../helpers/hooks';

import Layout from '../constants/Layout';

const ProgressBadge = ({ close, videos }) => {
  const [badgeTransform, setBadgeTransform] = useState({});
  const { animationValue, animateTo } = useAnimation({ autoPlay: true });

  const videoCount = Object.keys(videos).length;

  const animateOpacity = {
    opacity: animationValue.current.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    })
  };

  useEffect(() => {
    animateTo(1);
  }, []);

  const handleClose = () => {
    animateTo(0);
    setTimeout(() => close(), 150);
  };

  const calculateTotalProgress = () => {
    let totalProgress = 0;
    const fileValues = Object.values(videos);

    if (!fileValues || fileValues.length <= 0) return 0;

    fileValues.forEach(({ progress }) => {
      totalProgress += progress;
    });

    return Math.round((totalProgress / fileValues.length) * 100);
  };

  const totalProgress = calculateTotalProgress();

  useEffect(() => {
    if (totalProgress === 100) handleClose();
  }, [totalProgress]);

  const handleOnLayout = ({
    nativeEvent: {
      layout: { y }
    }
  }) => {
    const transform = [
      {
        translateY: animationValue.current.interpolate({
          inputRange: [0, 1],
          outputRange: [-(y - 24), y]
        })
      }
    ];

    setBadgeTransform(transform);
  };

  return (
    <View style={styles.badgeContainer}>
      <Animated.View
        style={[styles.badge, badgeTransform, animateOpacity]}
        onLayout={handleOnLayout}
      >
        <Text style={styles.message}>
          Uploading {videoCount} {videoCount > 1 ? 'videos' : 'video'} -{' '}
          {totalProgress}%
        </Text>
        <View style={[styles.progress, { width: `${totalProgress}%` }]} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    alignItems: 'center',
    bottom: 60,
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 98
  },
  badge: {
    backgroundColor: '#303537',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 6,
    maxWidth: Layout.window.width - 24
  },
  message: {
    color: '#fff',
    textAlign: 'center',
    zIndex: 1
  },
  progress: {
    backgroundColor: 'rgba(255,255,255, 0.2)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  }
});

ProgressBadge.propTypes = {
  close: func.isRequired,
  videos: object
};

ProgressBadge.defaultProps = {
  videos: {}
};

export default ProgressBadge;
