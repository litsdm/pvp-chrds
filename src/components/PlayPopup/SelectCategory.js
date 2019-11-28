import React from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { arrayOf, bool, func, shape, string } from 'prop-types';

import CategoryColumn from '../CategoryColumn';

import Layout from '../../constants/Layout';

const SelectCategory = ({
  handleNext,
  selectCategory,
  selectedCategory,
  categories,
  directPlay,
  handleDone
}) => {
  const renderCategories = () =>
    categories.map(({ _id, name, description, image, color }) => (
      <CategoryColumn
        key={_id}
        name={name}
        description={description}
        image={image}
        color={color}
        onPress={selectCategory(_id)}
        selecting
        selected={selectedCategory === _id}
      />
    ));

  const disabled = selectedCategory === null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <CategoryColumn
          name="Random"
          description="Selects a random category"
          onPress={selectCategory('-1')}
          color="#03A9F4"
          selecting
          selected={selectedCategory === '-1'}
        />
        {renderCategories()}
      </ScrollView>
      <TouchableOpacity
        style={[styles.button, disabled ? styles.disabled : {}]}
        onPress={directPlay ? handleDone : handleNext}
        disabled={disabled}
      >
        <Text style={[styles.buttonText, disabled ? styles.disabledText : {}]}>
          {directPlay ? 'Play' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: Layout.window.width
  },
  title: {
    fontFamily: 'sf-bold',
    fontSize: 24,
    marginVertical: 24
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
  },
  disabled: {
    backgroundColor: 'rgba(44, 44, 44, 0.2)'
  },
  disabledText: {
    color: '#777'
  }
});

SelectCategory.propTypes = {
  handleNext: func.isRequired,
  selectCategory: func.isRequired,
  selectedCategory: string,
  directPlay: bool.isRequired,
  handleDone: func.isRequired,
  categories: arrayOf(
    shape({
      _id: string,
      name: string,
      description: string,
      image: string,
      color: string
    })
  )
};

SelectCategory.defaultProps = {
  categories: [],
  selectedCategory: null
};

export default SelectCategory;
