import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { func } from 'prop-types';

import Modal from './Modal';
import Input from './Auth/Input';

const MemberModal = ({ close, makeMember, handleReject, displayBadge }) => {
  const [email, setEmail] = useState('');

  const verifyEmail = checkEmail =>
    new Promise((resolve, reject) => {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const valid = re.test(String(checkEmail).toLowerCase());

      console.log(checkEmail);

      if (!valid) reject(new Error('Email is invalid.'));
      resolve();
    });

  const handleAccept = async () => {
    try {
      await verifyEmail(email);

      await makeMember(email);
      displayBadge('You are now part of the 100!', 'success');
      close();
    } catch (exception) {
      displayBadge(exception.message, 'error');
    }
  };

  const handleClose = async () => {
    try {
      await handleReject();
    } catch (exception) {
      console.log(exception.message);
    }
    close();
  };

  return (
    <Modal close={handleClose}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Charades&apos; 100!</Text>
        <Text style={styles.subtitle}>
          Experience the pro subscription for 2 months for free! Just leave your
          email below and let the games begin.
        </Text>
        <Input label="Email" value={email} onChangeText={setEmail} />
        <View style={styles.footer}>
          <TouchableOpacity style={styles.rejectButton} onPress={handleClose}>
            <Text style={styles.rejectText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
            <Text style={styles.acceptText}>Join the 100</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24
  },
  title: {
    color: '#000',
    fontFamily: 'sf-bold',
    fontSize: 18,
    textAlign: 'center'
  },
  subtitle: {
    color: '#000',
    fontFamily: 'sf-regular',
    fontSize: 14,
    marginVertical: 12,
    textAlign: 'center',
    width: '80%'
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 24
  },
  rejectButton: {
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
    width: '50%'
  },
  rejectText: {
    color: '#777',
    fontFamily: 'sf-medium',
    fontSize: 16
  },
  acceptButton: {
    alignItems: 'center',
    backgroundColor: '#7c4dff',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    width: '50%'
  },
  acceptText: {
    color: '#fff',
    fontFamily: 'sf-medium'
  }
});

MemberModal.propTypes = {
  close: func.isRequired,
  makeMember: func.isRequired,
  handleReject: func.isRequired,
  displayBadge: func.isRequired
};

export default MemberModal;
