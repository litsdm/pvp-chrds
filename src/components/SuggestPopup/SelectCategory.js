import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { arrayOf, func, shape, string } from 'prop-types';

import Layout from '../../constants/Layout';

const SelectCategory = ({ categories, selectCategory }) => (
  <View style={styles.categoryContainer}>
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.categoryTitle}>Please select a category</Text>
      {categories.map(category => (
        <TouchableOpacity
          key={category._id}
          style={styles.row}
          onPress={selectCategory(category)}
        >
          {category.image ? (
            <Image source={{ uri: category.image }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <FontAwesome5 size={18} color="#fff" name="image" />
            </View>
          )}
          <Text style={styles.category}>{category.name}</Text>
        </TouchableOpacity>
      ))}
      <Text style={styles.disclaimer}>
        Your custom categories will show up here even if they have not been
        accepted yet.
      </Text>
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  category: {
    fontFamily: 'sf-regular',
    fontSize: 14
  },
  categoryContainer: {
    flex: 1,
    paddingHorizontal: 12,
    width: Layout.window.width
  },
  categoryTitle: {
    color: 'rgba(0,0,0,0.6)',
    fontFamily: 'sf-regular',
    fontSize: 14,
    marginTop: 12,
    textTransform: 'uppercase'
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 12,
    width: '100%'
  },
  image: {
    borderRadius: 8,
    height: 30,
    marginRight: 12,
    width: 30
  },
  disclaimer: {
    alignSelf: 'center',
    fontFamily: 'sf-regular',
    fontSize: 12,
    marginTop: 12,
    opacity: 0.4,
    textAlign: 'center'
  },
  imagePlaceholder: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 8,
    height: 30,
    justifyContent: 'center',
    marginRight: 12,
    width: 30
  }
});

SelectCategory.propTypes = {
  selectCategory: func.isRequired,
  categories: arrayOf(
    shape({
      _id: string,
      name: string,
      image: string
    })
  ).isRequired
};

export default SelectCategory;
