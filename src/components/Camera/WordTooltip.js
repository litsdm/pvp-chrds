import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { string } from 'prop-types';

const WordTooltip = ({ word }) => (
  <View style={styles.container}>
    <View style={styles.card}>
      <Text style={styles.title}>Act out the word</Text>
      <Text style={styles.word}>{word}</Text>
    </View>
    <View style={styles.triangle} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    borderRadius: 12,
    backgroundColor: '#26282D',
    paddingHorizontal: 24,
    paddingVertical: 12
  },
  title: {
    color: '#fff',
    fontWeight: '600',
    opacity: 0.6,
    marginBottom: 6,
    textAlign: 'center'
  },
  word: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  triangle: {
    backgroundColor: 'transparent',
    borderBottomColor: '#26282D',
    borderBottomWidth: 15,
    borderLeftColor: 'transparent',
    borderLeftWidth: 10,
    borderStyle: 'solid',
    borderRightColor: 'transparent',
    borderRightWidth: 10,
    height: 0,
    transform: [{ rotate: '180deg' }],
    width: 0
  }
});

WordTooltip.propTypes = {
  word: string.isRequired
};

export default WordTooltip;
