import React from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { func, number } from 'prop-types';

import { useAnimation } from '../../helpers/hooks';

import MedalIcon from '../../../assets/icons/ribbon.svg';

const PRE_ICON = Platform.OS === 'ios' ? 'ios' : 'md';

const EndOverlay = ({ medalCount, remove, goHome }) => {
  const { animationValue } = useAnimation({ autoPlay: true, duration: 400 });

  const animateOverlay = {
    opacity: animationValue.current.interpolate({
      inputRange: [0, 0.5],
      outputRange: [0, 1]
    })
  };

  const animateTitle = {
    transform: [
      {
        scale: animationValue.current.interpolate({
          inputRange: [0.5, 1],
          outputRange: [0.2, 1]
        })
      }
    ]
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.overlay, animateOverlay]} />
      <Animated.Text style={[styles.title, animateTitle]}>
        You win!
      </Animated.Text>
      <View style={styles.rewardList}>
        <View style={styles.row}>
          <Ionicons size={16} color="#fff" name={`${PRE_ICON}-add`} />
          <Text style={styles.count}>{medalCount + 3}</Text>
          <MedalIcon width={18} height={18} />
          <Text style={styles.rowText}>Medals</Text>
        </View>
        <View style={styles.row}>
          <Ionicons size={16} color="#fff" name={`${PRE_ICON}-add`} />
          <Text style={styles.count}>5</Text>
          <FontAwesome5 name="coins" size={18} color="#FFC107" />
          <Text style={styles.rowText}>Coins</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.buttonPrimary} onPress={goHome}>
        <Text style={styles.buttonPrimaryText}>Go to Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonSecondary} onPress={remove}>
        <Text style={styles.buttonSecondaryText}>Remove match</Text>
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
  title: {
    color: '#fff',
    fontFamily: 'sf-bold',
    fontSize: 28,
    marginVertical: 48
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
  rewardList: {
    marginBottom: 48
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  count: {
    color: '#fff',
    fontFamily: 'sf-regular',
    fontSize: 16,
    marginLeft: 6,
    marginRight: 12
  },
  rowText: {
    color: '#fff',
    fontFamily: 'sf-regular',
    fontSize: 16,
    marginLeft: 6
  }
});

EndOverlay.propTypes = {
  medalCount: number.isRequired,
  goHome: func.isRequired,
  remove: func.isRequired
};

export default EndOverlay;
