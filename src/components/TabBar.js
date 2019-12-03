import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { Ionicons } from '@expo/vector-icons';
import { func, object } from 'prop-types';

import GET_DATA from '../graphql/queries/getPlayData';

import Tab from './Tab';
import PlayPopup from './PlayPopup';

const TabBar = ({ renderIcon, navigation, onTabPress }) => {
  const { data, client } = useQuery(GET_DATA);
  const { routes, index } = navigation.state;
  const homeStack = routes[index];
  const nestedRouteName = homeStack.routes[homeStack.index].routeName;

  const { displayPlay, playCategory, playFriend } = data || {};

  const closePlay = () =>
    client.writeData({
      data: { displayPlay: false, playCategory: null, playFriend: null }
    });

  const showPlay = () => client.writeData({ data: { displayPlay: true } });

  return (
    <>
      {nestedRouteName !== 'Camera' ? (
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
      ) : null}
      {displayPlay ? (
        <PlayPopup
          close={closePlay}
          category={playCategory}
          friend={playFriend}
          navigate={navigation.navigate}
        />
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
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
  navigation: object.isRequired
};

export default TabBar;
