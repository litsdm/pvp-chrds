import React, { useState, useEffect, useRef } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { bool, func, object, string } from 'prop-types';

import { usePrevious, useAnimation } from '../../helpers/hooks';

const Input = ({
  value,
  label,
  onChangeText,
  keyboardType,
  secureTextEntry,
  iconName,
  containerStyle
}) => {
  const [animateText, setAnimateText] = useState({});
  const [isFocused, setFocused] = useState(false);
  const { animationValue, animateTo } = useAnimation();
  const previousValue = usePrevious(value);
  const input = useRef(null);

  useEffect(() => {
    if (previousValue !== '' && value === '' && input.current)
      input.current.clear();
  }, [value]);

  useEffect(() => {
    if (isFocused && !value) animateTo(1);
    else if (!isFocused && !value) animateTo(0);
  }, [isFocused]);

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  const focus = () => {
    if (input.current) input.current.focus();
  };

  const handleOnLayout = ({
    nativeEvent: {
      layout: { width, y }
    }
  }) => {
    const scaleTo = 0.7;
    const complementScaling = 1 - scaleTo;
    const horizontalScalingDiff = (complementScaling * width) / 2;

    const transform = [
      {
        translateX: animationValue.current.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -horizontalScalingDiff]
        })
      },
      {
        translateY: animationValue.current.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -(y - 4)]
        })
      },
      {
        scale: animationValue.current.interpolate({
          inputRange: [0, 1],
          outputRange: [1, scaleTo]
        })
      }
    ];

    setAnimateText({ transform });
  };

  return (
    <TouchableWithoutFeedback onPress={focus}>
      <View
        style={[
          styles.container,
          isFocused ? { backgroundColor: '#fff', borderColor: '#7C4DFF' } : {},
          containerStyle
        ]}
      >
        <Animated.Text
          onLayout={handleOnLayout}
          style={[styles.label, animateText]}
        >
          {label}
        </Animated.Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          underlineColorAndroid="transparent"
          selectionColor="#7C4DFF"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCapitalize="none"
          ref={input}
        />
        {iconName ? (
          <View style={styles.iconContainer}>
            <Ionicons
              size={26}
              color={isFocused ? 'rgba(124,77,255, 0.6)' : 'rgba(0, 0, 0, 0.4)'}
              name={`${Platform.OS === 'ios' ? 'ios' : 'md'}-${iconName}`}
            />
          </View>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(96, 125, 139, 0.1)',
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 8,
    height: 62,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingVertical: 6,
    marginBottom: 12,
    width: '85%'
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6A6D70',
    position: 'absolute',
    bottom: '40%',
    left: 24
  },
  input: {
    fontSize: 16,
    fontWeight: '600',
    height: 40,
    width: '100%'
  },
  iconContainer: {
    alignItems: 'center',
    height: 62,
    position: 'absolute',
    justifyContent: 'center',
    right: 0,
    width: 50
  }
});

Input.propTypes = {
  label: string,
  value: string,
  onChangeText: func,
  keyboardType: string,
  secureTextEntry: bool,
  iconName: string,
  containerStyle: object
};

Input.defaultProps = {
  label: '',
  value: '',
  onChangeText: () => {},
  keyboardType: 'default',
  secureTextEntry: false,
  iconName: '',
  containerStyle: {}
};

export default Input;
