import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import LottieView from 'lottie-react-native';
import { func, number, shape } from 'prop-types';

import { usePrevious, useAnimation } from '../../helpers/hooks';

import lvlAnimation from '../../../assets/animations/motion.json';

import LevelProgressBar from '../LevelProgressBar';

const SuccessOverlay = ({ user, goHome, playNext }) => {
  const animation = useRef(null);
  const previousLevel = usePrevious(user.level);
  const { animationValue } = useAnimation({
    autoPlay: true,
    duration: 600
  });

  const animateOverlay = {
    opacity: animationValue.current.interpolate({
      inputRange: [0, 1 / 3],
      outputRange: [0, 1]
    })
  };

  const animateTitle = {
    transform: [
      {
        scale: animationValue.current.interpolate({
          inputRange: [1 / 3, 2 / 3],
          outputRange: [0.2, 1]
        })
      }
    ]
  };

  const animateRest = {
    opacity: animationValue.current.interpolate({
      inputRange: [2 / 3, 1],
      outputRange: [0, 1]
    })
  };

  useEffect(() => {
    if (previousLevel < user.level) {
      animation.current.play();
    }
  }, [user.level]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.overlay, animateOverlay]} />
      <Animated.View style={[styles.lvlContainer, animateRest]}>
        <View style={styles.lvlWrapper}>
          <Text style={styles.lvlLabel}>Lvl</Text>
          <View>
            <LottieView
              style={styles.animation}
              source={lvlAnimation}
              ref={animation}
              autoPlay={false}
              loop={false}
              autoSize
            />
            <Text style={styles.lvl}>{user.level}</Text>
          </View>
        </View>
        <LevelProgressBar progress={10} />
      </Animated.View>
      <Animated.Text style={[styles.title, animateTitle]}>
        You got it!
      </Animated.Text>
      <Animated.View style={animateRest}>
        <TouchableOpacity style={styles.buttonPrimary} onPress={playNext}>
          <Text style={styles.buttonPrimaryText}>Play your Turn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSecondary} onPress={goHome}>
          <Text style={styles.buttonSecondaryText}>Go to Home</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 5
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: -1
  },
  title: {
    color: '#fff',
    fontFamily: 'sf-bold',
    fontSize: 24,
    marginVertical: 48
  },
  lvlContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '50%'
  },
  lvlWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12
  },
  lvlLabel: {
    color: '#fff',
    fontFamily: 'sf-regular',
    fontSize: 20,
    marginRight: 12
  },
  lvl: {
    color: '#fff',
    fontFamily: 'sf-medium',
    fontSize: 30
  },
  animation: {
    height: 84,
    left: -16,
    position: 'absolute',
    top: -8,
    width: 84
  },
  buttonPrimary: {
    alignItems: 'center',
    backgroundColor: '#7c4dff',
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
    minWidth: '45%'
  },
  buttonPrimaryText: {
    color: '#fff',
    fontFamily: 'sf-bold',
    fontSize: 18
  },
  buttonSecondary: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: '45%'
  },
  buttonSecondaryText: {
    color: '#7c4dff',
    fontFamily: 'sf-bold',
    fontSize: 18
  }
});

SuccessOverlay.propTypes = {
  goHome: func.isRequired,
  playNext: func.isRequired,
  user: shape({
    level: number,
    xp: number
  })
};

SuccessOverlay.defaultProps = {
  user: {}
};

export default SuccessOverlay;
