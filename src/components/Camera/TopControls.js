import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { func, number, string } from 'prop-types';

const rand = Math.random();

const TopControls = ({
  goBack,
  uri,
  username,
  userScore,
  opponentScore,
  iconName
}) => (
  <View style={styles.container}>
    <LinearGradient
      style={styles.gradient}
      colors={['rgba(0, 0, 0, 0.5)', 'transparent']}
      pointerEvents="none"
    />
    <TouchableOpacity style={styles.backButton} onPress={goBack}>
      <Ionicons name={iconName} color="#fff" size={30} />
    </TouchableOpacity>
    <View style={styles.info}>
      <View style={styles.opponent}>
        <Image
          source={{ uri: `${uri}?rand=${rand}` }}
          style={styles.profilePic}
        />
        <Text style={styles.username}>{username}</Text>
      </View>
      <View style={styles.verticalDivider} />
      <View style={styles.scoreWrapper}>
        <Text style={styles.score}>
          {userScore} - {opponentScore}
        </Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    height: '50%',
    justifyContent: 'space-between',
    left: 0,
    paddingHorizontal: 24,
    paddingTop: 24,
    position: 'absolute',
    right: 0,
    top: 0
  },
  gradient: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  },
  info: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  opponent: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  profilePic: {
    borderRadius: 30 / 2,
    height: 30,
    marginRight: 6,
    width: 30
  },
  username: {
    color: '#fff',
    fontFamily: 'sf-medium',
    fontSize: 16
  },
  score: {
    color: '#fff',
    fontFamily: 'sf-medium',
    fontSize: 16
  },
  verticalDivider: {
    backgroundColor: '#fff',
    height: 16,
    marginHorizontal: 12,
    width: 1
  }
});

TopControls.propTypes = {
  goBack: func.isRequired,
  uri: string,
  username: string,
  userScore: number,
  opponentScore: number,
  iconName: string.isRequired
};

TopControls.defaultProps = {
  uri: '',
  username: '',
  userScore: 0,
  opponentScore: 0
};

export default TopControls;
