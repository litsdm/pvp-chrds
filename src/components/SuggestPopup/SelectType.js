import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { func } from 'prop-types';

import Layout from '../../constants/Layout';

const types = ['Word', 'Category'];

const SelectTypePage = ({ selectType }) => (
  <View style={styles.typeContainer}>
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.typeTitle}>Please select a type</Text>
      {types.map(type => (
        <TouchableOpacity
          key={type}
          style={styles.row}
          onPress={selectType(type)}
        >
          <Text style={styles.type}>{type}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  type: {
    fontFamily: 'sf-regular',
    fontSize: 14
  },
  typeContainer: {
    flex: 1,
    paddingHorizontal: 12,
    width: Layout.window.width
  },
  typeTitle: {
    color: 'rgba(0,0,0,0.6)',
    fontFamily: 'sf-regular',
    fontSize: 14,
    marginTop: 12,
    textTransform: 'uppercase'
  },
  row: {
    paddingVertical: 12,
    width: '100%'
  }
});

SelectTypePage.propTypes = {
  selectType: func.isRequired
};

export default SelectTypePage;
