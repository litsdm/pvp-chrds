import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { bool, func } from 'prop-types';

import Modal from '../Modal';

const PRE_ICON = Platform.OS === 'ios' ? 'ios' : 'md';

const ReplayModal = ({ handleAccept, handleReject, isLoading }) => (
  <Modal>
    <View style={styles.container}>
      <Text style={styles.question}>Do you want to try again?</Text>
      <TouchableOpacity
        style={styles.yesButton}
        onPress={handleAccept}
        disabled={isLoading}
      >
        <Text style={styles.yesText}>Watch Ad</Text>
        <Ionicons name={`${PRE_ICON}-play-circle`} size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleReject}
        disabled={isLoading}
      >
        <Text style={styles.noText}>Cancel</Text>
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
    paddingVertical: 8
  },
  yesText: {
    color: '#fff',
    fontFamily: 'sf-medium',
    fontSize: 18,
    marginRight: 8
  },
  noText: {
    color: 'rgba(0,0,0,0.7)',
    fontFamily: 'sf-medium',
    fontSize: 16
  }
});

ReplayModal.propTypes = {
  handleAccept: func.isRequired,
  handleReject: func.isRequired,
  isLoading: bool.isRequired
};

export default ReplayModal;
