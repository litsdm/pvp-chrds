import React from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { arrayOf, func, shape, string } from 'prop-types';

import CategoryColumn from '../CategoryColumn';

import Layout from '../../constants/Layout';

const SelectCategory = ({
  handleNext,
  selectCategory,
  selectedCategory,
  categories
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
        onPress={handleNext}
        disabled={disabled}
      >
        <Text style={[styles.buttonText, disabled ? styles.disabledText : {}]}>
          Next
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
    backgroundColor: 'rgba(124,77,255, 0.2)',
    borderRadius: 8,
    justifyContent: 'center',
    marginVertical: 24,
    paddingVertical: 6,
    width: '50%'
  },
  buttonText: {
    color: '#7c4dff',
    fontFamily: 'sf-bold',
    fontSize: 22
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
