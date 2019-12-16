import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { func, string } from 'prop-types';

import Modal from '../Modal';

const ReplayModal = ({ close, question, handleReplay }) => {
  const onReplayPress = () => {
    handleReplay();
    close();
  };

  return (
    <Modal close={close}>
      <View style={styles.container}>
        <Text style={styles.question}>{question}</Text>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button} onPress={onReplayPress}>
            <Text style={styles.yesText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={close}>
            <Text style={styles.noText}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24
  },
  question: {
    color: 'rgba(0,0,0,0.8)',
    fontFamily: 'sf-medium',
    fontSize: 16,
    textAlign: 'center'
  },
  buttons: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  button: {
    padding: 12
  },
  yesText: {
    color: '#7c4dff',
    fontFamily: 'sf-medium',
    fontSize: 16
  },
  noText: {
    color: 'rgba(0,0,0,0.7)',
    fontFamily: 'sf-medium',
    fontSize: 16
  }
});

ReplayModal.propTypes = {
  close: func.isRequired,
  question: string.isRequired,
  handleReplay: func.isRequired
};

export default ReplayModal;
