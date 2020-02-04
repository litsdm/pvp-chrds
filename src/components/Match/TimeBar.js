import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import { bool, func, number } from 'prop-types';

import Layout from '../../constants/Layout';

const IS_IPHONE_X =
  Constants.deviceName.includes('iPhone X') ||
  Constants.deviceName.includes('iPhone 11');

const TimeBar = ({ timeLeft, setTimeLeft, onEnd, milis, isPaused }) => {
  useCountdown(timeLeft, setTimeLeft, onEnd, milis, isPaused);
  return (
    <View style={styles.timeBarWrapper}>
      <View style={[styles.timeBar, { width: `${(timeLeft * 100) / 300}%` }]}>
        <LinearGradient
          style={styles.gradient}
          colors={['#FF5252', '#7c4dff']}
          start={[0.0, 0.5]}
          end={[1.0, 0.5]}
          locations={[0.0, 1.0]}
        />
      </View>
    </View>
  );
};

function useCountdown(timeLeft, setTimeLeft, onEnd, milis, isPaused) {
  let interval;

  useEffect(() => {
    if (interval) clearInterval(interval);
  }, [milis]);

  useEffect(() => {
    interval = setInterval(() => {
      setTimeLeft(current => {
        if (isPaused) return current;
        if (current <= 0) {
          clearInterval(interval);
          onEnd();
          return 0;
        }

        return current - 1;
      });
    }, milis);

    return () => clearInterval(interval);
  });

  return timeLeft;
}

const styles = StyleSheet.create({
  timeBarWrapper: {
    height: 4,
    left: 0,
    position: 'absolute',
    right: 0,
    top: IS_IPHONE_X ? 44 : 0,
    zIndex: 2
  },
  timeBar: {
    height: 4,
    overflow: 'hidden',
    width: '100%'
  },
  gradient: {
    position: 'absolute',
    height: '100%',
    width: Layout.window.width
  }
});

TimeBar.propTypes = {
  onEnd: func.isRequired,
  timeLeft: number,
  setTimeLeft: func.isRequired,
  milis: number,
  isPaused: bool
};

TimeBar.defaultProps = {
  timeLeft: 300,
  milis: 10,
  isPaused: false
};

export default TimeBar;
