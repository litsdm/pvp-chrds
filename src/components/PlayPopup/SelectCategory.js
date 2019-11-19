import React from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import CategoryColumn from '../CategoryColumn';

import Layout from '../../constants/Layout';

const SelectCategory = ({ handleNext, selectCategory }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Select Category</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <CategoryColumn
        name="Movie Characters"
        description="Characters from a lot of movies recent and old."
        onPress={selectCategory(0)}
        selecting
      />
      <CategoryColumn
        name="Movie Characters"
        description="Characters from a lot of movies recent and old."
        onPress={selectCategory(0)}
        selecting
      />
      <CategoryColumn
        name="Movie Characters"
        description="Characters from a lot of movies recent and old."
        onPress={selectCategory(0)}
        selecting
      />
    </ScrollView>
    <TouchableOpacity style={styles.button} onPress={handleNext}>
      <Text style={styles.buttonText}>Next</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
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
  }
});

export default SelectCategory;
