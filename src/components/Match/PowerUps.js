import React, { useEffect } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { func } from 'prop-types';

import { useAnimation } from '../../helpers/hooks';

const PowerUps = ({ slowDown, showHint }) => {
  const { animationValue, animateTo } = useAnimation();

  useEffect(() => {
    setTimeout(() => animateTo(1), 8000);
  }, []);

  const animateOpacity = {
    opacity: animationValue.current.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0]
    })
  };

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Animated.View style={[styles.info, animateOpacity]}>
          <Text style={styles.infoText}>Bomb - Blast unnecessary letters.</Text>
          <View style={styles.triangle} />
        </Animated.View>
        <TouchableOpacity style={styles.iconButton}>
          <FontAwesome5 name="bomb" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.item}>
        <Animated.View style={[styles.info, animateOpacity]}>
          <Text style={styles.infoText}>Hourglass - Slower countdown.</Text>
          <View style={styles.triangle} />
        </Animated.View>
        <TouchableOpacity style={styles.iconButton} onPress={slowDown}>
          <FontAwesome5 name="hourglass-half" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.item}>
        <Animated.View style={[styles.info, animateOpacity]}>
          <Text style={styles.infoText}>Hint</Text>
          <View style={styles.triangle} />
        </Animated.View>
        <TouchableOpacity style={styles.iconButton} onPress={showHint}>
          <FontAwesome5 name="info-circle" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.item}>
        <Animated.View style={[styles.info, animateOpacity]}>
          <Text style={styles.infoText}>Fill - 2 random letters.</Text>
          <View style={styles.triangle} />
        </Animated.View>
        <TouchableOpacity style={styles.iconButton}>
          <FontAwesome5 name="fill-drip" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    position: 'absolute',
    right: 24,
    top: getStatusBarHeight() + 72,
    zIndex: 3
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 24
  },
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

PowerUps.propTypes = {
  slowDown: func.isRequired,
  showHint: func.isRequired
};

export default PowerUps;
