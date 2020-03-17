import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { func } from 'prop-types';

import Layout from '../../constants/Layout';

import VideoButton from '../VideoButton';

const EmptyRow = ({ createOwn }) => {
  const animationValue = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animationValue.current, {
          toValue: 1,
          duration: 1000
        }),
        Animated.timing(animationValue.current, {
          toValue: 2,
          duration: 1000
        }),
        Animated.timing(animationValue.current, {
          toValue: 3,
          duration: 1000
        }),
        Animated.timing(animationValue.current, {
          toValue: 4,
          duration: 1000
        }),
        Animated.timing(animationValue.current, {
          toValue: 5,
          duration: 1000
        }),
        Animated.timing(animationValue.current, {
          toValue: 0,
          duration: 0
        })
      ]),
      {
        iterations: 4
      }
    ).start();
  }, []);

  const color = {
    backgroundColor: animationValue.current.interpolate({
      inputRange: [0, 1, 2, 3, 4, 5],
      outputRange: [
        '#7c4dff',
        '#FF5252',
        '#FFC107',
        '#4CAF50',
        '#2196F3',
        '#7c4dff'
      ]
    })
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        style={styles.gradientTop}
        colors={['rgba(0, 0, 0, 0.4)', 'transparent']}
        pointerEvents="none"
      />
      <View style={styles.iconWrapper}>
        <FontAwesome5
          name="sad-cry"
          solid
          color="rgba(255,255,255,0.8)"
          size={60}
        />
        <Animated.View style={[styles.iconBG, color]} />
      </View>
      <Text style={styles.title}>No More Videos</Text>
      <Text style={styles.description}>
        You&apos;ve reached the end of the FFA matches. Add your own now or ask
        your friends to add their own and keep up the fun!
      </Text>
      <VideoButton onPress={createOwn} text="Create your own!" />
      <LinearGradient
        style={styles.gradient}
        colors={['transparent', 'rgba(0, 0, 0, 0.4)']}
        pointerEvents="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: Layout.window.height,
    justifyContent: 'center',
    width: Layout.window.width
  },
  gradient: {
    bottom: 0,
    height: '50%',
    left: 0,
    position: 'absolute',
    right: 0
  },
  gradientTop: {
    height: '50%',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  },
  title: {
    color: '#fff',
    fontFamily: 'sf-bold',
    fontSize: 24,
    marginBottom: 24,
    marginTop: 24,
    textAlign: 'center'
  },
  description: {
    color: '#fff',
    fontFamily: 'sf-medium',
    opacity: 0.6,
    textAlign: 'center',
    width: '80%'
  },
  iconWrapper: {
    alignItems: 'center',
    borderRadius: 60 / 2,
    height: 60,
    justifyContent: 'center',
    width: 60
  },
  iconBG: {
    backgroundColor: '#7c4dff',
    borderRadius: 58 / 2,
    height: 58,
    position: 'absolute',
    width: 58,
    zIndex: -1
  }
});

EmptyRow.propTypes = {
  createOwn: func.isRequired
};

export default EmptyRow;
