import React from 'react';
import {
  Platform,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { func, number, object } from 'prop-types';

const Header = ({ goBack, user, gameCount }) => (
  <View style={styles.header}>
    <View style={styles.nav}>
      <TouchableOpacity style={styles.back} onPress={goBack}>
        <Ionicons name="ios-arrow-round-back" size={30} color="#000" />
      </TouchableOpacity>
    </View>
    <View style={styles.profile}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: user.profilePic }} style={styles.profilePic} />
      </View>
      <View>
        <Text style={styles.username}>{user.displayName}</Text>
        <Text style={styles.subText}>Level {user.level}</Text>
      </View>
    </View>
    <View style={styles.divider} />
    <View style={styles.stats}>
      <View style={styles.statColumn}>
        <Text style={styles.stat}>{user.wonGames}</Text>
        <Text style={styles.statName}>Games Won</Text>
      </View>
      <View style={styles.statColumn}>
        <Text style={styles.stat}>{gameCount}</Text>
        <Text style={styles.statName}>FFA Games</Text>
      </View>
      <View style={styles.statColumn}>
        <Text style={styles.stat}>{user.ffaPoints}</Text>
        <Text style={styles.statName}>FFA Points</Text>
      </View>
    </View>
    <View style={styles.divider} />
    <View style={styles.actions}>
      <TouchableOpacity style={styles.challengeButton}>
        <Text style={styles.challengeText}>Challenge</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.moreButton}>
        <Ionicons name="ios-more" size={30} color="#000" />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    padding: 24,
    paddingTop: 0
  },
  nav: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 54,
    justifyContent: 'flex-start',
    width: '100%'
  },
  profile: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 24
  },
  imageWrapper: {
    alignItems: 'center',
    borderRadius: 84 / 2,
    elevation: 4,
    height: 84,
    justifyContent: 'center',
    marginRight: 24,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: 84
  },
  profilePic: {
    borderRadius: 84 / 2,
    height: 84,
    width: 84
  },
  username: {
    fontFamily: 'sf-bold',
    fontSize: 24,
    bottom: Platform.OS === 'ios' ? 0 : -3
  },
  subText: {
    fontFamily: 'sf-light',
    fontSize: 16,
    opacity: 0.4,
    top: Platform.OS === 'ios' ? 0 : -3
  },
  divider: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    height: 1,
    width: '100%'
  },
  stats: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 24
  },
  statColumn: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  stat: {
    fontFamily: 'sf-bold',
    fontSize: 18
  },
  statName: {
    fontFamily: 'sf-light',
    fontSize: 12,
    opacity: 0.6
  },
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24
  },
  challengeButton: {
    alignItems: 'center',
    backgroundColor: '#7c4dff',
    borderRadius: 8,
    elevation: 2,
    height: 42,
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    width: '70%'
  },
  challengeText: {
    color: '#fff',
    fontFamily: 'sf-medium'
  },
  moreButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    height: 42,
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    width: '20%'
  }
});

Header.propTypes = {
  goBack: func.isRequired,
  user: object.isRequired,
  gameCount: number.isRequired
};

export default Header;