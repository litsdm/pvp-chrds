import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import dayjs from 'dayjs';
import { func, instanceOf, string } from 'prop-types';

import Layout from '../constants/Layout';

const MatchRow = ({
  username,
  expiryDate,
  score,
  onPress,
  categoryUri,
  uri,
  position
}) => {
  const timeLeft = () => {
    const now = dayjs();
    const days = expiryDate.diff(now, 'days');
    const hours = expiryDate.diff(now, 'hours');

    if (days >= 1) return `${days}d`;
    if (days < 1 && hours >= 1) return `${hours}h`;
    return `${expiryDate.diff(now, 'minutes')}m`;
  };

  const positionStyles = () => {
    if (position === 'FirstLast')
      return { borderBottomWidth: 1, borderTopWidth: 1 };
    if (position === 'First') return { borderTopWidth: 1 };
    if (position === 'Last') return { borderBottomWidth: 1 };
  };

  const children = (
    <>
      <View style={styles.child}>
        <View style={styles.leftSide}>
          <Image source={{ uri }} style={styles.image} resizeMode="cover" />
          <View style={styles.info}>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.date}>{timeLeft()} left to play</Text>
          </View>
        </View>
        <View style={styles.rightSide}>
          <Image source={{ uri: categoryUri }} style={styles.category} />
          <Text style={styles.score}>{score}</Text>
        </View>
      </View>
      {position === 'Mid' || position === 'First' ? (
        <View style={styles.divider} />
      ) : null}
    </>
  );

  return onPress ? (
    <TouchableOpacity
      style={[styles.container, positionStyles()]}
      onPress={onPress}
    >
      {children}
      <Text style={styles.play}>Press to Play</Text>
    </TouchableOpacity>
  ) : (
    <View style={[styles.container, positionStyles()]}>{children}</View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.04)',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24
  },
  child: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  leftSide: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  rightSide: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  image: {
    borderRadius: 60 / 2,
    height: 60,
    marginRight: 12,
    width: 60
  },
  username: {
    fontFamily: 'sf-medium',
    fontSize: 16
  },
  date: {
    fontFamily: 'sf-regular',
    opacity: 0.4
  },
  category: {
    backgroundColor: '#C4C4C4',
    borderRadius: 6,
    height: 36,
    marginRight: 12,
    width: 36
  },
  score: {
    fontFamily: 'sf-regular',
    fontSize: 18
  },
  play: {
    color: '#7c4dff',
    fontFamily: 'sf-medium',
    fontSize: 10
  },
  divider: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    bottom: 0,
    height: 1,
    position: 'absolute',
    right: 0,
    width: Layout.window.width - 96
  }
});

MatchRow.propTypes = {
  onPress: func,
  username: string.isRequired,
  expiryDate: instanceOf(dayjs).isRequired,
  score: string.isRequired,
  categoryUri: string.isRequired,
  uri: string.isRequired,
  position: string.isRequired
};

MatchRow.defaultProps = {
  onPress: null
};

export default MatchRow;
