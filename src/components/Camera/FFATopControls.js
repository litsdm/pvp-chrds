import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getDeviceId } from 'react-native-device-info';
import { func, string } from 'prop-types';

import FFAIcon from '../../../assets/icons/ffa.svg';

const deviceID = getDeviceId();

const IS_IPHONE_X =
  deviceID.includes('iPhone12') || deviceID.includes('iPhone11');

const FFATopControls = ({ goBack, iconName }) => (
  <View style={styles.container}>
    <LinearGradient
      style={styles.gradient}
      colors={['rgba(0, 0, 0, 0.4)', 'transparent']}
      pointerEvents="none"
    />
    <View style={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Ionicons name={iconName} color="#fff" size={30} />
      </TouchableOpacity>
      <FFAIcon height={24} width={24} />
      <Text style={styles.mode}>Free for All</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    height: '50%',
    left: 0,
    paddingHorizontal: 24,
    paddingTop: 6,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 2
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: IS_IPHONE_X ? 44 : 0,
    width: '100%'
  },
  gradient: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  },
  backButton: {
    marginRight: 12
  },
  mode: {
    color: '#fff',
    fontFamily: 'sf-medium',
    marginLeft: 6
  }
});

FFATopControls.propTypes = {
  goBack: func.isRequired,
  iconName: string.isRequired
};

export default FFATopControls;
