import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { arrayOf, func, shape, string } from 'prop-types';

import SearchBar from '../AddFriendPopup/SearchBar';
import FriendRow from './FriendRow';

import Layout from '../../constants/Layout';

const SelectFriend = ({
  handleDone,
  friends,
  search,
  onChangeText,
  selected,
  select
}) => {
  const renderItem = args => {
    const { _id, username, profilePic } = args.item;
    return (
      <FriendRow
        username={username}
        uri={profilePic}
        onPress={select(_id)}
        selected={selected === _id}
      />
    );
  };

  const disabled = selected === null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Select an opponent</Text>
        <SearchBar search={search} onChangeText={onChangeText} />
        <FriendRow
          username="Random Opponent"
          onPress={select('-1')}
          selected={selected === '-1'}
        />
        <FlatList
          data={friends}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          extraData={selected}
        />
      </View>
      <TouchableOpacity
        style={[styles.button, disabled ? styles.disabled : {}]}
        onPress={handleDone}
        disabled={disabled}
      >
        <Text style={[styles.buttonText, disabled ? styles.disabledText : {}]}>
          Play
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: Layout.window.width
  },
  title: {
    fontFamily: 'sf-bold',
    fontSize: 24,
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center'
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#7c4dff',
    borderRadius: 8,
    justifyContent: 'center',
    marginVertical: 24,
    paddingVertical: 6,
    width: '50%'
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'sf-bold',
    fontSize: 18
  },
  disabled: {
    backgroundColor: 'rgba(44, 44, 44, 0.2)'
  },
  disabledText: {
    color: '#777'
  },
  content: {
    justifyContent: 'flex-start',
    width: '85%'
  }
});

SelectFriend.propTypes = {
  handleDone: func.isRequired,
  onChangeText: func.isRequired,
  select: func.isRequired,
  selected: string,
  search: string.isRequired,
  friends: arrayOf(
    shape({
      _id: string,
      username: string,
      email: string,
      profilePic: string
    })
  )
};

SelectFriend.defaultProps = {
  selected: null
};

SelectFriend.defaultProps = {
  friends: []
};

export default SelectFriend;
