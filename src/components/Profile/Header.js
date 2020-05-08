import React from 'react';
import {
  Platform,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { bool, func, number, object } from 'prop-types';

const PRE_ICON = Platform.OS === 'ios' ? 'ios' : 'md';

const Header = ({
  goBack,
  user,
  gameCount,
  isSelf,
  onChallengePress,
  onMorePress,
  navigateToSettings,
  openShop
}) => (
  <View style={styles.header}>
    <View style={[styles.nav, isSelf ? styles.navSelf : {}]}>
      <TouchableOpacity style={styles.back} onPress={goBack}>
        <Ionicons name="ios-arrow-round-back" size={30} color="#000" />
      </TouchableOpacity>
      {isSelf ? (
        <View style={styles.rightNav}>
          <TouchableOpacity style={styles.shopButton} onPress={openShop}>
            <Ionicons name={`${PRE_ICON}-cart`} size={16} color="#7c4dff" />
            <Text style={styles.shopText}>Shop</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={navigateToSettings}
          >
            <Ionicons name="ios-settings" size={30} color="#000" />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
    <View style={styles.profile}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: user.profilePic }} style={styles.profilePic} />
      </View>
      <View>
        <Text style={styles.username}>{user.displayName}</Text>
        <Text style={styles.subText}>
          Level <Text style={styles.subTextHighlight}>{user.level}</Text>
        </Text>
        <View style={styles.subTextWrapper}>
          <FontAwesome5
            name="coins"
            color="#FFC107"
            size={12}
            style={styles.coins}
          />
          <Text style={styles.subText}>
            <Text style={styles.subTextHighlight}>{user.coins}</Text> coins
          </Text>
        </View>
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
    {!isSelf ? (
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.challengeButton}
          onPress={onChallengePress}
        >
          <Text style={styles.challengeText}>Challenge</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreButton} onPress={onMorePress}>
          <Ionicons name="ios-more" size={30} color="#000" />
        </TouchableOpacity>
      </View>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  header: {
    padding: 24,
    paddingTop: 0,
    zIndex: -1
  },
  back: {
    alignItems: 'center',
    height: 30,
    justifyContent: 'center',
    width: 30
  },
  nav: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 54,
    justifyContent: 'flex-start',
    width: '100%'
  },
  navSelf: {
    justifyContent: 'space-between'
  },
  rightNav: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  shopButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(124,77,255, 0.2)',
    borderRadius: 24,
    flexDirection: 'row',
    height: 30,
    justifyContent: 'center',
    marginRight: 8,
    paddingHorizontal: 12
  },
  shopText: {
    color: '#7c4dff',
    fontFamily: 'sf-medium',
    marginLeft: 6
  },
  settingsButton: {
    alignItems: 'center',
    height: 30,
    justifyContent: 'flex-end',
    width: 30
  },
  coins: {
    marginRight: 6,
    top: -3
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
    fontSize: 20,
    bottom: Platform.OS === 'ios' ? 0 : -3
  },
  subText: {
    color: '#999',
    fontFamily: 'sf-light',
    fontSize: 14,
    top: Platform.OS === 'ios' ? 0 : -3
  },
  subTextHighlight: {
    color: '#666'
  },
  subTextWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start'
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
  gameCount: number.isRequired,
  isSelf: bool.isRequired,
  onChallengePress: func.isRequired,
  onMorePress: func.isRequired,
  navigateToSettings: func.isRequired,
  openShop: func.isRequired
};

export default Header;
