import React from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { func, string } from 'prop-types';

import { useAnimation } from '../../helpers/hooks';

const FailOverlay = ({ goHome, playNext, word }) => {
  const { animationValue } = useAnimation({ autoPlay: true });

  const animateOpacity = {
    opacity: animationValue.current.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    })
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.overlay, animateOpacity]} />
      <Text style={styles.title}>Better luck next round!</Text>
      <Text style={styles.word}>
        The word was <Text style={{ fontFamily: 'sf-bold' }}>{word}</Text>
      </Text>
      <TouchableOpacity style={styles.buttonPrimary} onPress={playNext}>
        <Text style={styles.buttonPrimaryText}>Play next round</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonSecondary} onPress={goHome}>
        <Text style={styles.buttonSecondaryText}>Go to Home</Text>
      </TouchableOpacity>
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
  },
  title: {
    color: '#fff',
    fontFamily: 'sf-bold',
    fontSize: 24,
    textAlign: 'center'
  },
  word: {
    color: '#fff',
    fontFamily: 'sf-regular',
    fontSize: 18,
    marginBottom: 48,
    marginTop: 12,
    textAlign: 'center'
  }
});

FailOverlay.propTypes = {
  goHome: func.isRequired,
  playNext: func.isRequired,
  word: string.isRequired
};

export default FailOverlay;
