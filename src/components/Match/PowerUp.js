import React, { useEffect } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { func, string } from 'prop-types';

import { useAnimation } from '../../helpers/hooks';

const PowerUp = ({ text, onPress, icon }) => {
  const { animationValue, animateTo } = useAnimation();

  useEffect(() => {
    setTimeout(() => animateTo(1), 6000);
  }, []);

  const animateOpacity = {
    opacity: animationValue.current.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0]
    })
  };

  return (
    <View style={styles.item}>
      <Animated.View style={[styles.info, animateOpacity]}>
        <Text style={styles.infoText}>{text}</Text>
        <View style={styles.triangle} />
      </Animated.View>
      <TouchableOpacity style={styles.iconButton} onPress={onPress}>
        <FontAwesome5 name={icon} size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  info: {
    alignItems: 'center',
    backgroundColor: '#26282D',
    borderRadius: 4,
    justifyContent: 'center',
    marginRight: 24,
    padding: 6
  },
  infoText: {
    color: '#fff',
    fontFamily: 'sf-regular'
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 24
  },
  iconButton: {
    alignItems: 'center',
    height: 30,
    justifyContent: 'center',
    width: 30
  },
  triangle: {
    backgroundColor: 'transparent',
    borderBottomColor: '#26282D',
    borderBottomWidth: 15,
    borderLeftColor: 'transparent',
    borderLeftWidth: 10,
    borderStyle: 'solid',
    borderRightColor: 'transparent',
    borderRightWidth: 10,
    height: 0,
    position: 'absolute',
    right: -15,
    transform: [{ rotate: '90deg' }],
    width: 0
  }
});

PowerUp.propTypes = {
  onPress: func.isRequired,
  text: string.isRequired,
  icon: string.isRequired
};

export default PowerUp;
