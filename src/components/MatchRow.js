import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import moment from 'moment';
import { func, string } from 'prop-types';
import { momentObj } from 'react-moment-proptypes';

const rand = Math.random();

const MatchRow = ({
  username,
  expiryDate,
  score,
  onPress,
  categoryUri,
  uri
}) => {
  const timeLeft = () => {
    const now = moment();
    const days = expiryDate.diff(now, 'days');
    const hours = expiryDate.diff(now, 'hours');

    if (days >= 1) return `${days}d`;
    if (days < 1 && hours >= 1) return `${hours}h`;
    return `${expiryDate.diff(now, 'minutes')}m`;
  };

  const children = (
    <>
      <View style={styles.leftSide}>
        <Image
          source={{ uri: `${uri}?rand=${rand}` }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.info}>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.date}>{timeLeft()} left to play</Text>
        </View>
      </View>
      <View style={styles.rightSide}>
        <Image
          source={{ uri: `${categoryUri}?rand=${rand}` }}
          style={styles.category}
        />
        <Text style={styles.score}>{score}</Text>
      </View>
    </>
  );

  return onPress ? (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {children}
    </TouchableOpacity>
  ) : (
    <View style={styles.container}>{children}</View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 24
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
  }
});

MatchRow.propTypes = {
  onPress: func,
  username: string.isRequired,
  expiryDate: momentObj.isRequired,
  score: string.isRequired,
  categoryUri: string.isRequired,
  uri: string.isRequired
};

MatchRow.defaultProps = {
  onPress: null
};

export default MatchRow;
