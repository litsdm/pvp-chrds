import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { func, number, string } from 'prop-types';

const WordTooltip = ({ word, rollCount, roll, color, openPurchase }) => (
  <View style={styles.container}>
    <View style={[styles.card, { backgroundColor: color }]}>
      <Text style={styles.title}>Act out the word</Text>
      <Text style={styles.word}>{word}</Text>
      <TouchableOpacity
        style={styles.rollButton}
        onPress={rollCount === 0 ? openPurchase : roll}
      >
        {rollCount > 0 ? (
          <>
            <FontAwesome5 name="dice" size={16} color="#fff" />
            <Text style={styles.buttonText}>{rollCount} Re-roll</Text>
          </>
        ) : (
          <>
            <FontAwesome5 name="hand-pointer" size={16} color="#fff" />
            <Text style={styles.buttonText}>Pick word</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
    <View style={[styles.triangle, { borderBottomColor: color }]} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    borderRadius: 12,
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
  },
  rollButton: {
    alignItems: 'center',
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    padding: 6
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'sf-regular',
    marginLeft: 6
  }
});

WordTooltip.propTypes = {
  word: string,
  rollCount: number.isRequired,
  roll: func.isRequired,
  color: string.isRequired,
  openPurchase: func.isRequired
};

WordTooltip.defaultProps = {
  word: ''
};

export default WordTooltip;
