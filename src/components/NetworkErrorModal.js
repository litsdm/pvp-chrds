import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useApolloClient } from '@apollo/react-hooks';

import Modal from './Modal';

const NetworkErrorModal = () => {
  const client = useApolloClient();
  const retry = () => client.resetStore();
  const timeLeft = useCountdown(retry);

  return (
    <Modal>
      <View style={styles.container}>
        <Text style={styles.title}>Network Error</Text>
        <Text style={styles.subtitle}>
          Please double check your internet connection. If this issue persists
          please contact support.
        </Text>
        <Text style={styles.status}>Retrying again in {timeLeft} seconds</Text>
        <TouchableOpacity style={styles.button} onPress={retry}>
          <Text style={styles.buttonText}>Retry Now</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

function useCountdown(retry) {
  const [timeLeft, setTimeLeft] = useState(10);
  const [prevTime, setPrevTime] = useState(10);
  let interval;

  useEffect(() => {
    interval = setInterval(() => {
      setTimeLeft(current => {
        if (current <= 0) {
          const newTime = prevTime === 60 ? 60 : prevTime + 10;
          clearInterval(interval);
          retry();
          setPrevTime(newTime);
          return newTime;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  });

  return timeLeft;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  title: {
    fontFamily: 'sf-bold',
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center'
  },
  subtitle: {
    fontFamily: 'sf-light',
    opacity: 0.8,
    marginBottom: 24,
    textAlign: 'center'
  },
  status: {
    fontFamily: 'sf-bold',
    marginBottom: 24,
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#7c4dff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600'
  }
});

export default NetworkErrorModal;
