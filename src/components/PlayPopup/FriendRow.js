import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { bool, func, string } from 'prop-types';

const FriendRow = ({ username, uri, onPress, selected }) => (
  <TouchableOpacity
    style={[styles.container, selected ? styles.containerSelect : {}]}
    onPress={onPress}
  >
    <View style={styles.imageWrapper}>
      {selected ? (
        <View style={styles.imageOverlay}>
          <Ionicons name="ios-checkmark" size={36} color="#7c4dff" />
        </View>
      ) : null}
      {uri ? (
        <Image style={styles.image} source={{ uri }} />
      ) : (
        <View style={styles.icon}>
          <Ionicons size={36} name="ios-shuffle" color="#fff" />
        </View>
      )}
    </View>
    <Text style={[styles.username, { color: selected ? '#7c4dff' : '#000' }]}>
      {username}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 6
  },
  containerSelect: {
    backgroundColor: 'rgba(124,77,255, 0.1)'
  },
  imageWrapper: {
    alignItems: 'center',
    borderRadius: 42 / 2,
    height: 42,
    justifyContent: 'center',
    marginRight: 12,
    width: 42
  },
  imageOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 42 / 2,
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1
  },
  image: {
    borderRadius: 42 / 2,
    height: 42,
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
  selected: {
    alignItems: 'center',
    backgroundColor: '#7C4DFF',
    borderRadius: 8,
    height: 42,
    justifyContent: 'center',
    width: 42
  },
  icon: {
    alignItems: 'center',
    backgroundColor: '#03A9F4',
    borderRadius: 42 / 2,
    height: 42,
    justifyContent: 'center',
    width: 42
  }
});

FriendRow.propTypes = {
  username: string.isRequired,
  uri: string,
  onPress: func.isRequired,
  selected: bool.isRequired
};

FriendRow.defaultProps = {
  uri: null
};

export default FriendRow;
