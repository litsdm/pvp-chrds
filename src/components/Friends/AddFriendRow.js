import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { func } from 'prop-types';

const PRE_ICON = Platform.OS === 'ios' ? 'ios' : 'md';

const AddFriendRow = ({ openPopup }) => (
  <TouchableOpacity style={styles.add} onPress={openPopup}>
    <View style={styles.icon}>
      <Ionicons name={`${PRE_ICON}-person-add`} size={24} color="#fff" />
    </View>
    <Text style={styles.rowText}>Add Friend</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  add: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginVertical: 24
  },
  icon: {
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#7c4dff',
    height: 36,
    justifyContent: 'center',
    marginRight: 12,
    width: 36
  },
  rowText: {
    fontFamily: 'sf-medium',
    fontSize: 16
  }
});

AddFriendRow.propTypes = {
  openPopup: func.isRequired
};

export default AddFriendRow;
