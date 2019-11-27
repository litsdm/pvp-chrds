import React from 'react';
import { Image, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { func, string } from 'prop-types';

const FriendRow = ({ onPress, uri, username, requestID, resolveRequest }) => (
  <TouchableOpacity
    style={styles.container}
    onPress={!requestID ? onPress : null}
  >
    <View style={styles.info}>
      <Image style={styles.image} source={{ uri }} resizeMode="cover" />
      <Text style={styles.username} numberOfLines={1}>
        {username}
      </Text>
    </View>
    {requestID ? (
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.accept}
          onPress={resolveRequest(requestID, 'accept')}
        >
          <Ionicons size={28} color="#7c4dff" name="ios-checkmark" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.reject}
          onPress={resolveRequest(requestID, 'reject')}
        >
          <Ionicons size={28} color="#f44336" name="ios-close" />
        </TouchableOpacity>
      </View>
    ) : null}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#FDFDFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  },
  info: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  actions: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  reject: {
    alignItems: 'center',
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    borderRadius: 15,
    height: 30,
    justifyContent: 'center',
    width: 30
  },
  accept: {
    alignItems: 'center',
    backgroundColor: 'rgba(124,77,255, 0.2)',
    borderRadius: 15,
    height: 30,
    justifyContent: 'center',
    marginRight: 12,
    width: 30
  }
});

FriendRow.propTypes = {
  onPress: func,
  uri: string.isRequired,
  username: string.isRequired,
  requestID: string,
  resolveRequest: func
};

FriendRow.defaultProps = {
  onPress: null,
  requestID: null,
  resolveRequest: null
};

export default FriendRow;
