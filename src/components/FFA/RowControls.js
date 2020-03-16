import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { func, number, string } from 'prop-types';

import VideoButton from '../VideoButton';

const RowControls = ({
  username,
  categoryName,
  handleGuess,
  guessedResult
}) => {
  const guessedData = () => {
    if (guessedResult === 1)
      return { text: 'Guessed', icon: 'md-checkmark', color: '#4CD964' };
    if (guessedResult === 2)
      return { text: 'Failed', icon: 'ios-sad', color: '#FF5252' };

    return { text: 'Guess Word', icon: 'chevron-right', color: '#7c4dff' };
  };

  const { text, icon, color } = guessedData();
  const didGuess = guessedResult !== 0;

  return (
    <>
      <View style={styles.info}>
        <Text style={styles.username}>@{username}</Text>
        <Text style={styles.category}>Acting {categoryName}</Text>
      </View>
      {didGuess ? (
        <View style={styles.button}>
          <Text style={[styles.buttonText, didGuess ? styles.disabled : {}]}>
            {text}
          </Text>
          <Ionicons
            style={{ opacity: 0.6 }}
            name={icon}
            size={14}
            color={color}
          />
        </View>
      ) : (
        <VideoButton
          style={styles.vButton}
          onPress={handleGuess}
          text={text}
          iconName={icon}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  info: {
    bottom: 24,
    left: 24,
    position: 'absolute',
    width: '57%',
    zIndex: 2
  },
  username: {
    color: '#fff',
    fontFamily: 'sf-medium',
    fontSize: 14,
    marginBottom: 12
  },
  category: {
    color: '#fff',
    fontFamily: 'sf-medium',
    fontSize: 14
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    bottom: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    position: 'absolute',
    right: 24,
    zIndex: 2
  },
  vButton: {
    bottom: 24,
    position: 'absolute',
    right: 24,
    zIndex: 2
  },
  buttonText: {
    color: '#7c4dff',
    fontFamily: 'sf-medium',
    fontSize: 12,
    marginRight: 6
  },
  disabled: {
    color: '#afafaf'
  }
});

RowControls.propTypes = {
  username: string.isRequired,
  categoryName: string.isRequired,
  handleGuess: func.isRequired,
  guessedResult: number
};

RowControls.defaultProps = {
  guessedResult: 0
};

export default RowControls;
