import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { arrayOf, func, shape, string } from 'prop-types';

import Modal from '../Modal';

const PickWordModal = ({ words, handleDone }) => {
  const [selected, setSelected] = useState(null);

  const select = index => () => setSelected(index);

  const done = () => handleDone(selected);

  const renderItem = args => {
    const { text } = args.item;
    const isSelected = selected === args.index;
    return (
      <View style={styles.row}>
        <Text style={styles.word}>{text}</Text>
        <TouchableOpacity
          style={[isSelected ? styles.selected : styles.select]}
          onPress={select(args.index)}
        >
          <Text style={styles.selectText}>
            {isSelected ? 'Picked' : 'Pick'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal>
      <View style={styles.container}>
        <Text style={styles.title}>Pick a Word</Text>
        <View style={styles.list}>
          <FlatList
            renderItem={renderItem}
            data={words}
            keyExtractor={item => item._id}
            extraData={selected}
          />
        </View>
        <TouchableOpacity
          style={styles.doneButton}
          onPress={done}
          disabled={selected === null}
        >
          <Text
            style={[
              styles.buttonText,
              { color: selected !== null ? '#7c4dff' : 'rgba(0,0,0,0.5)' }
            ]}
          >
            Done
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  title: {
    color: '#000',
    fontFamily: 'sf-bold',
    fontSize: 18,
    marginBottom: 12
  },
  list: {
    maxHeight: 320,
    width: '100%'
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12
  },
  word: {
    fontFamily: 'sf-medium',
    fontSize: 16
  },
  select: {
    alignItems: 'center',
    backgroundColor: 'rgba(124,77,255, 0.2)',
    borderColor: 'transparent',
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    paddingVertical: 3,
    paddingHorizontal: 12
  },
  selected: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: '#7c4dff',
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    paddingVertical: 3,
    paddingHorizontal: 12
  },
  selectText: {
    color: '#7c4dff',
    fontFamily: 'sf-medium'
  },
  doneButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    width: '100%'
  },
  buttonText: {
    fontFamily: 'sf-medium'
  }
});

PickWordModal.propTypes = {
  handleDone: func.isRequired,
  words: arrayOf(
    shape({
      _id: string,
      text: string,
      hint: string
    })
  ).isRequired
};

export default PickWordModal;
