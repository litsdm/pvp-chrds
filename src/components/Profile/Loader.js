import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { bool, func } from 'prop-types';

import Layout from '../../constants/Layout';

import Loader from '../Loader';

const ProfileLoader = ({ goBack, isSelf }) => {
  const animationValue = useRef(new Animated.Value(1));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animationValue.current, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true
        }),
        Animated.timing(animationValue.current, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        })
      ])
    ).start();
  }, []);

  const animateOpacity = {
    opacity: animationValue.current.interpolate({
      inputRange: [0, 1],
      outputRange: [0.2, 0.7]
    })
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.nav}>
          <TouchableOpacity style={styles.back} onPress={goBack}>
            <Ionicons name="ios-arrow-round-back" size={30} color="#000" />
          </TouchableOpacity>
        </View>
        <Animated.View style={[styles.profile, animateOpacity]}>
          <View style={styles.imageHolder} />
          <View>
            <View style={styles.usernameHolder} />
            <View style={styles.levelHolder} />
          </View>
        </Animated.View>
        <View style={styles.divider} />
        <Animated.View style={[styles.stats, animateOpacity]}>
          <View style={styles.statColumn}>
            <View style={styles.statHolder} />
            <View style={styles.statNameHolder} />
          </View>
          <View style={styles.statColumn}>
            <View style={styles.statHolder} />
            <View style={styles.statNameHolder} />
          </View>
          <View style={styles.statColumn}>
            <View style={styles.statHolder} />
            <View style={styles.statNameHolder} />
          </View>
        </Animated.View>
        <View style={styles.divider} />
        {!isSelf ? (
          <Animated.View style={[styles.actions, animateOpacity]}>
            <View style={styles.challengeHolder} />
            <View style={styles.moreHolder} />
          </Animated.View>
        ) : null}
      </View>
      <Loader />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FCFCFE',
    minHeight: Layout.window.height - 52,
    overflow: 'hidden',
    paddingTop: 0,
    paddingBottom: 24
  },
  header: {
    padding: 24,
    paddingTop: 0,
    zIndex: -1
  },
  nav: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 54,
    justifyContent: 'flex-start',
    width: '100%'
  },
  profile: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 24,
    opacity: 1
  },
  divider: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    height: 1,
    width: '100%'
  },
  stats: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 24
  },
  statColumn: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24
  },
  imageHolder: {
    backgroundColor: '#999',
    borderRadius: 84 / 2,
    height: 84,
    marginRight: 24,
    width: 84
  },
  usernameHolder: {
    backgroundColor: '#999',
    height: 24,
    marginBottom: 6,
    width: 108
  },
  levelHolder: {
    backgroundColor: '#ccc',
    height: 16,
    width: 108
  },
  statHolder: {
    backgroundColor: '#999',
    height: 30,
    marginBottom: 6,
    width: 30
  },
  statNameHolder: {
    backgroundColor: '#ccc',
    height: 18,
    width: 60
  },
  challengeHolder: {
    backgroundColor: '#999',
    borderRadius: 8,
    height: 42,
    width: '70%'
  },
  moreHolder: {
    backgroundColor: '#ccc',
    borderRadius: 8,
    height: 42,
    width: '20%'
  }
});

ProfileLoader.propTypes = {
  goBack: func.isRequired,
  isSelf: bool.isRequired
};

export default ProfileLoader;
