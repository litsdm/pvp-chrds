import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { LinearGradient } from 'expo-linear-gradient';
import { func, number } from 'prop-types';

import Layout from '../../constants/Layout';

const TimeBar = ({ timeLeft, setTimeLeft, onEnd, milis }) => {
  useCountdown(timeLeft, setTimeLeft, onEnd, milis);
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

function useCountdown(timeLeft, setTimeLeft, onEnd, milis) {
  let interval;

  useEffect(() => {
    if (interval) clearInterval(interval);
  }, [milis]);

  useEffect(() => {
    interval = setInterval(() => {
      setTimeLeft(current => {
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
    top: getStatusBarHeight(),
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
  milis: number
};

TimeBar.defaultProps = {
  timeLeft: 300,
  milis: 10
};

export default TimeBar;
