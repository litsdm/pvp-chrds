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
import { func, object, string } from 'prop-types';

import Layout from '../../constants/Layout';

const WordForm = ({
  type,
  category,
  word,
  hint,
  actorHint,
  setState,
  submit
}) => (
  <TouchableWithoutFeedback>
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.selected}>Suggestion type: {type}</Text>
        <View style={styles.divider} />
        <Text style={styles.selected}>Word category: {category.name}</Text>
        <View style={styles.divider} />
        <View>
          <View style={styles.labelWrapper}>
            <Text style={styles.label}>Word</Text>
            <Text style={styles.chars}>{word.length}/30</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Type your word here"
            onChangeText={setState('word')}
            textAlignVertical="top"
            maxLength={30}
            multiline
          />
        </View>
        <View style={styles.divider} />
        <View>
          <View style={styles.labelWrapper}>
            <Text style={styles.label}>Hint</Text>
            <Text style={styles.chars}>{hint.length}/140</Text>
          </View>
          <TextInput
            style={styles.hintInput}
            placeholder="Please provide a hint for the guessers"
            onChangeText={setState('hint')}
            textAlignVertical="top"
            maxLength={140}
            multiline
          />
        </View>
        <View style={styles.divider} />
        <View>
          <View style={styles.labelWrapper}>
            <Text style={styles.label}>Actor Hint (optional)</Text>
            <Text style={styles.chars}>{actorHint.length}/140</Text>
          </View>
          <TextInput
            style={styles.hintInput}
            placeholder="You can provide a hint for the actor as well"
            onChangeText={setState('actorHint')}
            textAlignVertical="top"
            maxLength={140}
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

WordForm.propTypes = {
  type: string.isRequired,
  category: object.isRequired,
  word: string.isRequired,
  hint: string.isRequired,
  actorHint: string.isRequired,
  setState: func.isRequired,
  submit: func.isRequired
};

export default WordForm;
