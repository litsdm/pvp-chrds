import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { arrayOf, func, string } from 'prop-types';

import Popup from './Popup';

const CategoryPopup = ({ close, name, description, words, play }) => {
  const renderWords = () => {
    const selectedWords = {};

    while (Object.keys(selectedWords).length < 3) {
      const randomIndex = Math.floor(Math.random() * words.length);
      const randomWord = words[randomIndex];

      if (!selectedWords[randomWord]) selectedWords[randomWord] = 1;
    }

    return Object.keys(selectedWords).map((word, index) => (
      <Text
        key={word}
        style={[styles.word, { marginBottom: index === 2 ? 0 : 12 }]}
      >
        {word}
      </Text>
    ));
  };

  const handlePlay = () => {
    setTimeout(() => play(), 100);
    close();
  };

  return (
    <Popup close={close} showsDragIndicator={false}>
      <View style={styles.container}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.divider} />
        <Text style={styles.wordsTitle}>Words you may play</Text>
        {renderWords()}
        <View style={styles.divider} />
        <TouchableOpacity style={styles.button} onPress={handlePlay}>
          <Text style={styles.buttonText}>Play</Text>
        </TouchableOpacity>
      </View>
    </Popup>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18
  },
  title: {
    fontFamily: 'sf-bold',
    fontSize: 28,
    marginTop: 36,
    marginBottom: 24,
    textAlign: 'center'
  },
  description: {
    fontFamily: 'sf-regular',
    fontSize: 18,
    textAlign: 'center'
  },
  divider: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    height: 1,
    marginVertical: 24,
    width: '100%'
  },
  wordsTitle: {
    fontFamily: 'sf-bold',
    fontSize: 24,
    opacity: 0.3,
    marginBottom: 22
  },
  word: {
    fontFamily: 'sf-light',
    fontSize: 22,
    marginBottom: 12
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#7c4dff',
    borderRadius: 6,
    justifyContent: 'center',
    paddingVertical: 6,
    marginBottom: 24,
    width: '50%'
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'sf-bold',
    fontSize: 18
  }
});

CategoryPopup.propTypes = {
  close: func.isRequired,
  name: string.isRequired,
  description: string.isRequired,
  words: arrayOf(string).isRequired,
  play: func.isRequired
};

export default CategoryPopup;
