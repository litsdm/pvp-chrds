import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { bool, func, string } from 'prop-types';

const FriendRow = ({ username, uri, add, added }) => (
  <View style={styles.container}>
    <View style={styles.info}>
      <Image style={styles.image} source={{ uri }} />
      <Text style={styles.username}>{username}</Text>
    </View>
    {added ? (
      <View style={styles.added}>
        <Text style={styles.addedText}>Request Sent</Text>
      </View>
    ) : (
      <TouchableOpacity style={styles.add} onPress={add}>
        <Text style={styles.addText}>Add Friend</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  },
  info: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  add: {
    alignItems: 'center',
    backgroundColor: '#7c4dff',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  addText: {
    color: '#fff',
    fontFamily: 'sf-bold',
    fontSize: 12
  },
  added: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: '#7c4dff',
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  addedText: {
    color: '#7c4dff',
    fontFamily: 'sf-bold',
    fontSize: 12
  }
});

FriendRow.propTypes = {
  username: string.isRequired,
  uri: string.isRequired,
  add: func.isRequired,
  added: bool
};

FriendRow.defaultProps = {
  added: false
};

export default FriendRow;
