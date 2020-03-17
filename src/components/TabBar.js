import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { bool, func, object, string } from 'prop-types';

import {
  togglePlay,
  toggleAdd,
  toggleCategoryPurchase
} from '../actions/popup';

import Tab from './Tab';
import PlayPopup from './PlayPopup';

const mapDispatchToProps = dispatch => ({
  showPlay: () => dispatch(togglePlay(true)),
  closePlay: () =>
    dispatch(
      togglePlay(false, {
        playCategory: null,
        playFriend: null,
        playMode: null
      })
    ),
  openAdd: () => dispatch(toggleAdd(true)),
  openPurchase: data => dispatch(toggleCategoryPurchase(true, data))
});

const mapStateToProps = ({
  popup: { displayPlay, playCategory, playFriend, playMode }
}) => ({
  displayPlay,
  playCategory,
  playFriend,
  playMode
});

const TabBar = ({
  renderIcon,
  navigation,
  onTabPress,
  displayPlay,
  playCategory,
  playFriend,
  playMode,
  closePlay,
  showPlay,
  openAdd,
  openPurchase
}) => {
  const { routes, index } = navigation.state;
  const homeStack = routes[index];
  const nestedRouteName = homeStack.routes[homeStack.index].routeName;

  return (
    <>
      {nestedRouteName !== 'Camera' && nestedRouteName !== 'Match' ? (
        <SafeAreaView>
          <View style={styles.container}>
            <Tab
              renderIcon={renderIcon}
              route={routes[0]}
              isActive={index === 0}
              onTabPress={onTabPress}
            />
            <TouchableOpacity style={styles.play} onPress={showPlay}>
              <Ionicons name="logo-game-controller-b" size={26} color="#999" />
              <Text style={styles.playText}>Play</Text>
            </TouchableOpacity>
            <Tab
              renderIcon={renderIcon}
              route={routes[1]}
              isActive={index === 1}
              onTabPress={onTabPress}
            />
          </View>
        </SafeAreaView>
      ) : null}
      {displayPlay ? (
        <PlayPopup
          close={closePlay}
          category={playCategory}
          friend={playFriend}
          navigate={navigation.navigate}
          openAdd={openAdd}
          openPurchase={openPurchase}
          mode={playMode}
        />
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
    height: 52,
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    borderRadius: 24
  },
  play: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  playText: {
    color: '#000',
    fontFamily: 'sf-medium',
    fontSize: 10,
    opacity: 0.4
  }
});

TabBar.propTypes = {
  onTabPress: func.isRequired,
  renderIcon: func.isRequired,
  navigation: object.isRequired,
  displayPlay: bool.isRequired,
  playCategory: string,
  playFriend: string,
  playMode: string,
  closePlay: func.isRequired,
  showPlay: func.isRequired,
  openAdd: func.isRequired,
  openPurchase: func.isRequired
};

TabBar.defaultProps = {
  playCategory: null,
  playFriend: null,
  playMode: null
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TabBar);
