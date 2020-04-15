import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { bool, func } from 'prop-types';

import Modal from '../Modal';

const PRE_ICON = Platform.OS === 'ios' ? 'ios' : 'md';

const RetryModal = ({ handleWatchAd, handleBuy, handleReject, isLoading }) => (
  <Modal>
    <View style={styles.container}>
      <TouchableOpacity style={styles.close} onPress={handleReject}>
        <Ionicons name="md-close" size={20} color="#000" />
      </TouchableOpacity>
      <Text style={styles.question}>Do you want to try again?</Text>
      <TouchableOpacity style={styles.yesButton} onPress={handleBuy}>
        <Text style={styles.yesText}>
          Retry for <Text style={{ fontFamily: 'sf-bold' }}>40</Text>
        </Text>
        <FontAwesome5 name="coins" size={18} color="#FFC107" />
      </TouchableOpacity>
      <Text style={styles.orText}>OR</Text>
      <TouchableOpacity
        style={[styles.yesSecondButton]}
        onPress={handleWatchAd}
        disabled={isLoading}
      >
        <Text style={styles.yesSecondText}>Watch Ad</Text>
        <Ionicons name={`${PRE_ICON}-play-circle`} size={24} color="#7c4dff" />
      </TouchableOpacity>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  question: {
    color: 'rgba(0,0,0,0.8)',
    fontFamily: 'sf-bold',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 12
  },
  buttons: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  button: {
    padding: 12
  },
  yesButton: {
    alignItems: 'center',
    backgroundColor: '#7c4dff',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 160
  },
  yesText: {
    color: '#fff',
    fontFamily: 'sf-medium',
    fontSize: 18,
    marginRight: 8
  },
  yesSecondButton: {
    alignItems: 'center',
    borderColor: '#7c4dff',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 160
  },
  yesSecondText: {
    color: '#7c4dff',
    fontFamily: 'sf-medium',
    fontSize: 18,
    marginRight: 8
  },
  noText: {
    color: 'rgba(0,0,0,0.7)',
    fontFamily: 'sf-medium',
    fontSize: 16
  },
  orText: {
    color: '#7c4dff',
    fontFamily: 'sf-bold',
    fontSize: 12,
    marginVertical: 6
  },
  close: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 24 / 2,
    height: 24,
    right: 12,
    justifyContent: 'center',
    position: 'absolute',
    top: 6,
    width: 24
  }
});

RetryModal.propTypes = {
  handleWatchAd: func.isRequired,
  handleBuy: func.isRequired,
  handleReject: func.isRequired,
  isLoading: bool.isRequired
};

export default RetryModal;
