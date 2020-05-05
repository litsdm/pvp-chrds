import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { func } from 'prop-types';

import Layout from '../../constants/Layout';

import FFAIcon from '../../../assets/icons/ffa.svg';
import VersusIcon from '../../../assets/icons/1v1.svg';

const SelectMode = ({ selectMode }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Please select a game mode</Text>
    <View style={styles.content}>
      <TouchableOpacity onPress={selectMode(0)} style={styles.modeContainer}>
        <View style={styles.mode}>
          <View style={styles.iconWrapper}>
            <FFAIcon width={96} height={96} />
          </View>
          <Text style={styles.modeText}>Free for All</Text>
        </View>
        <View style={styles.buttonBottom} />
      </TouchableOpacity>
      <TouchableOpacity onPress={selectMode(1)} style={styles.modeContainer}>
        <View style={styles.mode}>
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: 'rgba(255,82,82, 0.2)' }
            ]}
          >
            <VersusIcon width={96} height={96} />
          </View>
          <Text style={styles.modeText}>1 VS 1</Text>
        </View>
        <View style={styles.buttonBottom} />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
    paddingHorizontal: 12,
    width: Layout.window.width
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    width: '100%'
  },
  modeContainer: {
    borderRadius: 12,
    elevation: 4,
    height: 198 + 6,
    width: Layout.window.width / 2 - 18
  },
  mode: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    padding: 18,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 1
  },
  modeText: {
    fontFamily: 'sf-medium',
    fontSize: 18,
    marginTop: 12
  },
  title: {
    color: 'rgba(0,0,0,0.6)',
    fontFamily: 'sf-regular',
    fontSize: 14,
    marginTop: 12,
    textTransform: 'uppercase'
  },
  iconWrapper: {
    alignItems: 'center',
    backgroundColor: 'rgba(1,180,75, 0.2)',
    borderRadius: 120 / 2,
    height: 120,
    justifyContent: 'center',
    width: 120
  },
  buttonBottom: {
    backgroundColor: '#7c4dff',
    borderRadius: 12,
    bottom: 0,
    height: 198 + 6,
    position: 'absolute',
    width: Layout.window.width / 2 - 18
  }
});

SelectMode.propTypes = {
  selectMode: func.isRequired
};

export default SelectMode;
