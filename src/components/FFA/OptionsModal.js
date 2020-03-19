import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { func } from 'prop-types';

import Modal from '../Modal';

const OptionsModal = ({ close }) => (
  <Modal style={styles.container} close={close} bgOpacity={0.4}>
    <View style={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Options</Text>
        <TouchableOpacity style={styles.closeIcon} onPress={close}>
          <Ionicons name="md-close" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
      <TouchableOpacity style={styles.row}>
        <Ionicons name="ios-warning" size={18} color="#000" />
        <Text style={styles.rowText}>Report video</Text>
      </TouchableOpacity>
      <View style={styles.divider} />
      <TouchableOpacity style={styles.row}>
        <Ionicons name="md-eye-off" size={18} color="#000" />
        <Text style={styles.rowText}>Hide videos from this user</Text>
      </TouchableOpacity>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    overflow: 'hidden',
    width: '100%'
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    paddingBottom: 0
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    width: '100%'
  },
  title: {
    fontFamily: 'sf-bold',
    fontSize: 14
  },
  closeIcon: {
    height: 24,
    position: 'absolute',
    right: 0,
    width: 24
  },
  divider: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    height: 1,
    width: '100%'
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 12,
    width: '100%'
  },
  rowText: {
    fontFamily: 'sf-medium',
    fontSize: 14,
    marginLeft: 6
  }
});

OptionsModal.propTypes = {
  close: func.isRequired
};

export default OptionsModal;
