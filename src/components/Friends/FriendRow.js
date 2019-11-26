import React from 'react';
import { Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { func, string } from 'prop-types';

const FriendRow = ({ onPress, uri, username }) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    <Image style={styles.image} source={{ uri }} resizeMode="cover" />
    <Text style={styles.username} numberOfLines={1}>
      {username}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#FDFDFF',
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 6,
    width: '100%'
  },
  image: {
    borderRadius: 42 / 2,
    height: 42,
    marginRight: 12,
    width: 42
  },
  username: {
    fontFamily: 'sf-medium',
    fontSize: 18
  }
});

FriendRow.propTypes = {
  onPress: func,
  uri: string.isRequired,
  username: string.isRequired
};

FriendRow.defaultProps = {
  onPress: null
};

export default FriendRow;
