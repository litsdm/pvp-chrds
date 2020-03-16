import React from 'react';
import { Image, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { func, string } from 'prop-types';

import Layout from '../../constants/Layout';

const FriendRow = ({
  onPress,
  uri,
  username,
  requestID,
  resolveRequest,
  position
}) => {
  const positionStyles = () => {
    if (position === 'FirstLast')
      return { borderBottomWidth: 1, borderTopWidth: 1 };
    if (position === 'First') return { borderTopWidth: 1 };
    if (position === 'Last') return { borderBottomWidth: 1 };
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.container, positionStyles()]}
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
      {position === 'Mid' || position === 'First' ? (
        <View style={styles.divider} />
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#FDFDFF',
    borderColor: 'rgba(0,0,0,0.04)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 6,
    width: '100%'
  },
  image: {
    borderRadius: 36 / 2,
    height: 36,
    marginRight: 12,
    width: 36
  },
  username: {
    fontFamily: 'sf-medium',
    fontSize: 16
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
  },
  divider: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    bottom: 0,
    height: 1,
    position: 'absolute',
    right: 0,
    width: Layout.window.width - 60
  }
});

FriendRow.propTypes = {
  onPress: func,
  uri: string.isRequired,
  username: string.isRequired,
  requestID: string,
  resolveRequest: func,
  position: string.isRequired
};

FriendRow.defaultProps = {
  onPress: null,
  requestID: null,
  resolveRequest: null
};

export default FriendRow;
