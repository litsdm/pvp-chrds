import React, { useEffect, useState, useRef } from 'react';
import {
  Animated,
  BackHandler,
  Keyboard,
  PanResponder,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { arrayOf, bool, func, object, oneOfType, node } from 'prop-types';

import { useAnimation } from '../helpers/hooks';
import Layout from '../constants/Layout';

const Popup = ({
  children,
  close,
  showsDragIndicator,
  animationOptions,
  onContentLayout,
  contentStyles,
  avoidKeyboard
}) => {
  const [contentHeight, setContentHeight] = useState(180);
  const [animateDisplay, setAnimateDisplay] = useState({});
  const { animationValue, animateTo } = useAnimation({
    type: 'spring',
    ...animationOptions
  });
  const position = useRef(new Animated.ValueXY());

  const animateOpacity = {
    opacity: animationValue.current.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    })
  };

  useEffect(() => {
    if (!avoidKeyboard) return;
    if (Platform.OS === 'ios') {
      Keyboard.addListener('keyboardWillShow', handleKeyboardShow);
      Keyboard.addListener('keyboardWillHide', handleKeyboardHide);
    } else {
      Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
      Keyboard.addListener('keyboardDidHide', handleKeyboardHide);
    }
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      if (Platform.OS === 'ios') {
        Keyboard.removeListener('keyboardWillShow', handleKeyboardShow);
        Keyboard.removeListener('keyboardWillHide', handleKeyboardHide);
      } else {
        Keyboard.removeListener('keyboardDidShow');
        Keyboard.removeListener('keyboardDidHide');
      }
      BackHandler.removeEventListener('hardwareBackPress');
    };
  }, []);

  const handleKeyboardShow = () => animateTo(2);
  const handleKeyboardHide = () => animateTo(1);
  const handleBackPress = () => {
    handleClose();
    return true;
  };

  const animatePosition = toValue => {
    Animated.spring(position.current, {
      toValue,
      duration: 200,
      useNativeDriver: true
    }).start();
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gesture) => {
      if (gesture.dy <= 0) return;
      position.current.setValue({ x: 0, y: gesture.dy });
    },
    onPanResponderRelease: (event, gesture) => {
      const threshold = contentHeight * 0.65;
      const checkAgainst = contentHeight - gesture.dy;
      if (threshold > checkAgainst) {
        animatePosition({ x: 0, y: contentHeight });
        handleClose();
      } else animatePosition({ x: 0, y: 0 });
    }
  });

  const handleClose = () => {
    animateTo(0);
    setTimeout(() => close(), 200);
  };

  const handleLayout = async ({ nativeEvent: { layout } }) => {
    const { height } = layout;
    const keyboardHeight = parseInt(
      await AsyncStorage.getItem('keyboardSize'),
      10
    );

    if (onContentLayout) onContentLayout(layout);

    const transform = [
      {
        translateY: animationValue.current.interpolate({
          inputRange: [0, 1, 2],
          outputRange: [
            0,
            -height,
            keyboardHeight ? -(height + keyboardHeight) : -height
          ]
        })
      }
    ];

    setAnimateDisplay({ transform });
    setContentHeight(height);
    animateTo(1);
  };

  return (
    <View style={styles.popup}>
      <Animated.View style={[styles.overlay, animateOpacity]}>
        <TouchableOpacity style={styles.closeOverlay} onPress={handleClose} />
      </Animated.View>
      <Animated.View
        style={[
          styles.content,
          {
            transform:
              position.current && animateDisplay.transform
                ? [
                    ...animateDisplay.transform,
                    ...position.current.getTranslateTransform()
                  ]
                : []
          },
          Platform.OS === 'ios' ? styles.posApple : styles.posAndroid,
          contentStyles
        ]}
        onLayout={handleLayout}
        {...panResponder.panHandlers}
      >
        {showsDragIndicator ? <View style={styles.slideIndicator} /> : null}
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  popup: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 5
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: -1
  },
  closeOverlay: {
    height: '100%',
    width: '100%'
  },
  content: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    left: 0,
    minHeight: 240,
    position: 'absolute',
    right: 0,
    top: Layout.window.height
  },
  slideIndicator: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 2,
    height: 4,
    position: 'absolute',
    top: 12,
    width: 60
  }
});

Popup.propTypes = {
  children: oneOfType([arrayOf(node), node]),
  close: func.isRequired,
  showsDragIndicator: bool,
  animationOptions: object,
  onContentLayout: func,
  contentStyles: object,
  avoidKeyboard: bool
};

Popup.defaultProps = {
  children: null,
  showsDragIndicator: true,
  animationOptions: {},
  onContentLayout: null,
  contentStyles: null,
  avoidKeyboard: true
};

export default Popup;
