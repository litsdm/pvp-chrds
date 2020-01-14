import React from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import { useAnimation } from '../../helpers/hooks';

const Navbar = ({ searching, toggleSearch, goBack, onChangeText }) => {
  const { animationValue, animateTo } = useAnimation();

  const animateOpacity = {
    opacity: animationValue.current.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0]
    })
  };

  const animateSearchOpacity = {
    opacity: animationValue.current.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    })
  };

  const handleToggle = () => {
    if (searching) animateTo(0);
    else animateTo(1);
    toggleSearch();
  };

  return (
    <View style={styles.navbar}>
      {searching ? (
        <Animated.View style={[styles.search, animateSearchOpacity]}>
          <TouchableOpacity style={styles.backButton} onPress={handleToggle}>
            <Ionicons name="ios-arrow-round-back" color="#000" size={30} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            onChangeText={onChangeText}
            underlineColorAndroid="transparent"
            selectionColor="#7C4DFF"
            placeholder="Search..."
          />
        </Animated.View>
      ) : (
        <Animated.View style={[styles.default, animateOpacity]}>
          <View style={styles.left}>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <Ionicons name="ios-arrow-round-back" color="#000" size={30} />
            </TouchableOpacity>
            <Text style={styles.title}>Friends</Text>
          </View>
          <View style={styles.right}>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleToggle}
            >
              <Ionicons
                name={`${Platform.OS === 'ios' ? 'ios' : 'md'}-search`}
                color="#000"
                size={30}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: '#fff',
    height: 54,
    left: 0,
    paddingHorizontal: 24,
    position: 'absolute',
    right: 0,
    top: Platform.OS === 'ios' ? getStatusBarHeight() : 0,
    width: '100%'
  },
  search: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 54,
    justifyContent: 'flex-start',
    width: '100%'
  },
  default: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 54,
    justifyContent: 'space-between',
    width: '100%'
  },
  left: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 54
  },
  title: {
    fontFamily: 'sf-bold',
    fontSize: 18
  },
  backButton: {
    height: 30,
    marginRight: 12,
    width: 30
  },
  right: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 54
  },
  input: {
    fontFamily: 'sf-medium'
  }
});

export default Navbar;
