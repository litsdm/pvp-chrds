import React, { useState, useRef } from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { func, string } from 'prop-types';

const PRE_ICON = Platform.OS === 'ios' ? 'ios' : 'md';

const SearchBar = ({ search, onChangeText }) => {
  const [focused, setFocused] = useState(false);
  const input = useRef(null);

  const focus = () => {
    if (input.current) input.current.focus();
    setFocused(true);
  };

  const handleBlur = () => setFocused(false);
  const handleFocus = () => setFocused(true);

  return (
    <TouchableWithoutFeedback onPress={focus}>
      <View style={[styles.container, focused ? styles.focused : {}]}>
        <View style={styles.iconWrapper}>
          <Ionicons name={`${PRE_ICON}-search`} size={30} color="#000" />
        </View>
        <TextInput
          style={styles.input}
          value={search}
          onChangeText={onChangeText}
          placeholder="Search..."
          selectionColor="#7c4dff"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#F1F3F4',
    borderColor: 'transparent',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    height: 54,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  focused: {
    backgroundColor: '#fff',
    borderColor: '#7c4dff'
  },
  iconWrapper: {
    alignItems: 'center',
    borderRadius: 8,
    height: 54,
    justifyContent: 'center',
    opacity: 0.6,
    width: 54
  },
  input: {
    height: 54,
    width: '100%'
  }
});

SearchBar.propTypes = {
  search: string.isRequired,
  onChangeText: func.isRequired
};

export default SearchBar;
