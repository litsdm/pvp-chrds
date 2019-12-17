import React from 'react';
import {
  Platform,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { func, string } from 'prop-types';

const PRE_ICON = Platform.OS === 'ios' ? 'ios' : 'md';
const rand = Math.random();

const MatchRow = ({ username, score, uri, onPress }) => (
  <View style={styles.container}>
    <View style={styles.leftSide}>
      <Image
        source={{ uri: `${uri}?rand=${rand}` }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.username}>{username}</Text>
      </View>
    </View>
    <View style={styles.rightSide}>
      <Text style={styles.score}>{score}</Text>
      <TouchableOpacity style={styles.remove} onPress={onPress}>
        <Ionicons
          color="rgba(0,0,0,0.6)"
          size={28}
          name={`${PRE_ICON}-trash`}
        />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 24
  },
  leftSide: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  rightSide: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  image: {
    borderRadius: 60 / 2,
    height: 60,
    marginRight: 12,
    width: 60
  },
  username: {
    fontFamily: 'sf-medium',
    fontSize: 16
  },
  score: {
    fontFamily: 'sf-regular',
    fontSize: 18,
    marginRight: 30
  },
  remove: {
    height: 28,
    width: 28
  }
});

MatchRow.propTypes = {
  username: string.isRequired,
  score: string.isRequired,
  uri: string.isRequired,
  onPress: func.isRequired
};

export default MatchRow;
