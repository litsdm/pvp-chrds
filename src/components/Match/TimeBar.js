import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { LinearGradient } from 'expo-linear-gradient';
import { func, number } from 'prop-types';

import Layout from '../../constants/Layout';

const TimeBar = ({ time, onEnd }) => {
  const timeLeft = useCountdown(time, onEnd);
  return (
    <View style={styles.timeBarWrapper}>
      <View style={[styles.timeBar, { width: `${(timeLeft * 100) / time}%` }]}>
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

function useCountdown(time, onEnd) {
  const [timeLeft, setTimeLeft] = useState(time);
  let interval;

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
    }, 100);

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
  time: number
};

TimeBar.defaultProps = {
  time: 300
};

export default TimeBar;
