import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { func, string } from 'prop-types';

import Modal from '../Modal';

import { useAnimation } from '../../helpers/hooks';

const HintModal = ({ close, hint }) => {
  const { animationValue, animateTo } = useAnimation({ autoPlay: true });

  const handleClose = () => {
    animateTo(0);
    setTimeout(() => close(), 200);
  };

  return (
    <Modal close={close} animationValue={animationValue} animateTo={animateTo}>
      <View style={styles.container}>
        <Text style={styles.hint}>{hint}</Text>
        <TouchableOpacity style={styles.button} onPress={handleClose}>
          <Text style={styles.buttonText}>Close Hint</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    paddingBottom: 12
  },
  hint: {
    fontFamily: 'sf-medium',
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center'
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 12,
    justifyContent: 'center',
    width: '100%'
  },
  buttonText: {
    color: 'rgba(124,77,255,0.8)',
    fontFamily: 'sf-medium',
    fontSize: 16
  }
});

HintModal.propTypes = {
  close: func.isRequired,
  hint: string.isRequired
};

export default HintModal;
