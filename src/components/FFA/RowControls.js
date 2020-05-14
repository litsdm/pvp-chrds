import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { bool, func, number, string } from 'prop-types';

import VideoButton from '../VideoButton';

import { GuessedTypes, AllowShareTypes } from '../../constants/Types';

const RowControls = ({
  username,
  categoryName,
  handleGuess,
  guessedResult,
  showOptions,
  isSelf,
  openRetry,
  openShare,
  allowShare
}) => {
  const guessedData = () => {
    if (guessedResult === GuessedTypes.SUCCESS)
      return { text: 'Guessed', icon: 'md-checkmark', color: '#4CD964' };
    if (guessedResult === GuessedTypes.FAIL)
      return { text: 'Retry', icon: 'chevron-right', color: '#7c4dff' };
    if (guessedResult === GuessedTypes.FAIL_RETRY)
      return { text: 'Failed', icon: 'ios-sad', color: '#FF5252' };

    return { text: 'Guess', icon: 'chevron-right', color: '#7c4dff' };
  };

  const renderShareButton = () => {
    if (allowShare === AllowShareTypes.EVERYONE || isSelf)
      return (
        <TouchableOpacity style={styles.share} onPress={openShare}>
          <FontAwesome5 name="share" size={30} color="#fff" />
        </TouchableOpacity>
      );
    return null;
  };

  const { text, icon, color } = guessedData();
  const didGuess =
    guessedResult === GuessedTypes.SUCCESS ||
    guessedResult === GuessedTypes.FAIL_RETRY;

  return (
    <>
      <View style={styles.info}>
        <Text style={styles.username}>@{username}</Text>
        <Text style={styles.category}>Acting {categoryName}</Text>
      </View>
      {!isSelf ? (
        <>
          <View style={styles.actionContainer}>
            <TouchableOpacity onPress={showOptions}>
              <Ionicons name="ios-options" size={30} color="#fff" />
            </TouchableOpacity>
            {renderShareButton()}
          </View>
          {didGuess ? (
            <View style={styles.button}>
              <Text
                style={[styles.buttonText, didGuess ? styles.disabled : {}]}
              >
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
              onPress={
                guessedResult === GuessedTypes.FAIL ? openRetry : handleGuess
              }
              text={text}
              iconName={icon}
            />
          )}
        </>
      ) : (
        <View style={styles.actionContainer}>{renderShareButton()}</View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  info: {
    bottom: 24,
    left: 18,
    position: 'absolute',
    width: '57%',
    zIndex: 2
  },
  username: {
    color: '#fff',
    fontFamily: 'sf-medium',
    fontSize: 14,
    marginBottom: 6
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
    right: 18,
    zIndex: 2
  },
  vButton: {
    bottom: 24,
    position: 'absolute',
    right: 18,
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
  },
  actionContainer: {
    bottom: 90,
    position: 'absolute',
    right: 18,
    zIndex: 1
  },
  share: {
    marginTop: 12
  }
});

RowControls.propTypes = {
  username: string.isRequired,
  categoryName: string.isRequired,
  handleGuess: func.isRequired,
  showOptions: func.isRequired,
  guessedResult: number,
  isSelf: bool.isRequired,
  openRetry: func.isRequired,
  openShare: func.isRequired,
  allowShare: number
};

RowControls.defaultProps = {
  guessedResult: 0,
  allowShare: AllowShareTypes.EVERYONE
};

export default RowControls;
