import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { bool, func, number } from 'prop-types';

import Layout from '../../constants/Layout';

import FFAIcon from '../../../assets/icons/ffa.svg';
import VersusIcon from '../../../assets/icons/1v1.svg';

const SelectMode = ({
  handleNext,
  handlePlay,
  selectMode,
  selected,
  didSelectCategory
}) => {
  const directPlay = didSelectCategory && selected === 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Game Mode</Text>
      <View style={styles.content}>
        <TouchableWithoutFeedback onPress={selectMode(0)}>
          <View
            style={[
              styles.mode,
              { borderColor: selected === 0 ? '#7c4dff' : 'rgba(0,0,0,0.1)' }
            ]}
          >
            <FFAIcon width={120} height={120} />
            <Text
              style={[styles.modeText, { opacity: selected === 0 ? 1 : 0.4 }]}
            >
              Free for All
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={selectMode(1)}>
          <View
            style={[
              styles.mode,
              { borderColor: selected === 1 ? '#7c4dff' : 'rgba(0,0,0,0.1)' }
            ]}
          >
            <VersusIcon width={120} height={120} />
            <Text
              style={[styles.modeText, { opacity: selected === 1 ? 1 : 0.4 }]}
            >
              1 Vs 1
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={directPlay ? handlePlay : handleNext}
      >
        <Text style={styles.buttonText}>{directPlay ? 'Play' : 'Next'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingBottom: 24,
    width: Layout.window.width
  },
  title: {
    fontFamily: 'sf-bold',
    fontSize: 24,
    marginVertical: 24
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%'
  },
  mode: {
    alignItems: 'center',
    borderColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    borderWidth: 3,
    justifyContent: 'center',
    padding: 18
  },
  modeText: {
    fontFamily: 'sf-medium',
    opacity: 0.4,
    marginTop: 12
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#7c4dff',
    borderRadius: 8,
    justifyContent: 'center',
    marginVertical: 24,
    paddingVertical: 6,
    width: '50%'
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'sf-bold',
    fontSize: 18
  }
});

SelectMode.propTypes = {
  handleNext: func.isRequired,
  selectMode: func.isRequired,
  selected: number.isRequired,
  didSelectCategory: bool.isRequired,
  handlePlay: func.isRequired
};

export default SelectMode;
