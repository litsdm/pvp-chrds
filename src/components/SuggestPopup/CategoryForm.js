import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { func, string } from 'prop-types';

import Layout from '../../constants/Layout';

const CategoryForm = ({ type, name, description, setState, submit }) => (
  <TouchableWithoutFeedback>
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.selected}>Suggestion type: {type}</Text>
        <View style={styles.divider} />
        <View>
          <View style={styles.labelWrapper}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.chars}>{name.length}/24</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Type your category's name"
            onChangeText={setState('name')}
            textAlignVertical="top"
            maxLength={24}
            multiline
          />
        </View>
        <View style={styles.divider} />
        <View>
          <View style={styles.labelWrapper}>
            <Text style={styles.label}>Small Description</Text>
            <Text style={styles.chars}>{description.length}/40</Text>
          </View>
          <TextInput
            style={styles.hintInput}
            placeholder="Provide a small description of your category"
            onChangeText={setState('description')}
            textAlignVertical="top"
            maxLength={40}
            multiline
          />
        </View>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.button} onPress={submit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  </TouchableWithoutFeedback>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    width: Layout.window.width
  },
  scrollContent: {
    paddingBottom: 42
  },
  selected: {
    fontFamily: 'sf-regular',
    marginVertical: 12
  },
  labelWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12
  },
  label: {
    fontFamily: 'sf-bold'
  },
  chars: {
    fontFamily: 'sf-regular',
    opacity: 0.4
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#7c4dff',
    borderRadius: 8,
    height: 54,
    justifyContent: 'center',
    marginTop: 24,
    width: '100%'
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'sf-medium'
  },
  divider: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    height: 1,
    width: '100%'
  }
});

CategoryForm.propTypes = {
  type: string.isRequired,
  name: string.isRequired,
  description: string.isRequired,
  setState: func.isRequired,
  submit: func.isRequired
};

export default CategoryForm;
