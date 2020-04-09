import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { func } from 'prop-types';

import { useAnimation } from '../../helpers/hooks';

import Modal from '../Modal';

const NotificationModal = ({ close, goToProfile }) => {
  const { animationValue, animateTo } = useAnimation({ autoPlay: true });

  const handleClose = () => {
    animateTo(0);
    setTimeout(() => close(), 200);
  };

  const handleNavigate = () => {
    goToProfile();
    handleClose();
  };

  return (
    <Modal close={close} animationValue={animationValue} animateTo={animateTo}>
      <View style={styles.container}>
        <Text style={styles.title}>Check out your Profile</Text>
        <Text style={styles.description}>
          Once your match is uploaded you can see it on your profile.
        </Text>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button} onPress={handleClose}>
            <Text style={styles.noText}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleNavigate}>
            <Text style={styles.yesText}>Go To Profile</Text>
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
  title: {
    fontFamily: 'sf-bold',
    textAlign: 'center',
    marginBottom: 12
  },
  descriptions: {
    fontFamily: 'sf-regular',
    fontSize: 12,
    marginBottom: 12,
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

NotificationModal.propTypes = {
  close: func.isRequired,
  goToProfile: func.isRequired
};

export default NotificationModal;
