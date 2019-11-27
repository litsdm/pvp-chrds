import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PRE_ICON = Platform.OS === 'ios' ? 'ios' : 'md';

const AddFriendRow = () => (
  <TouchableOpacity style={styles.add}>
    <View style={styles.icon}>
      <Ionicons name={`${PRE_ICON}-person-add`} size={24} color="#fff" />
    </View>
    <Text style={styles.rowText}>Add Friend</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  add: {
    alignItems: 'center',
    backgroundColor: '#FDFDFF',
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  icon: {
    alignItems: 'center',
    backgroundColor: '#7c4dff',
    borderRadius: 42 / 2,
    height: 42,
    justifyContent: 'center',
    marginRight: 12,
    width: 42
  },
  rowText: {
    fontFamily: 'sf-medium',
    fontSize: 18
  }
});

export default AddFriendRow;
