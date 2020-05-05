import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { arrayOf, func, shape, string } from 'prop-types';

import SearchBar from '../AddFriendPopup/SearchBar';
import FriendRow from './FriendRow';

import Layout from '../../constants/Layout';

const SelectFriend = ({ select, openAdd, search, onChangeText, friends }) => {
  const renderItem = args => {
    const { _id, displayName, profilePic } = args.item;
    return (
      <FriendRow
        username={displayName}
        uri={profilePic}
        onPress={select(_id)}
      />
    );
  };

  const ListHeader = (
    <>
      <FriendRow username="Add Friend" onPress={openAdd} />
      <FriendRow username="Random Opponent" onPress={select('-1')} />
    </>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Please select an opponent</Text>
      <SearchBar search={search} onChangeText={onChangeText} />
      <FlatList
        data={friends}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
    paddingHorizontal: 12,
    width: Layout.window.width
  },
  title: {
    color: 'rgba(0,0,0,0.6)',
    fontFamily: 'sf-regular',
    fontSize: 14,
    marginTop: 12,
    marginBottom: 12,
    textTransform: 'uppercase'
  }
});

SelectFriend.propTypes = {
  onChangeText: func.isRequired,
  openAdd: func.isRequired,
  select: func.isRequired,
  search: string.isRequired,
  friends: arrayOf(
    shape({
      _id: string,
      username: string,
      profilePic: string
    })
  )
};

SelectFriend.defaultProps = {
  friends: []
};

export default SelectFriend;
