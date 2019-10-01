import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export function useAnimation(duration = 100, useNativeDriver = true) {
  const animationValue = useRef(new Animated.Value(0));

  const animateTo = toValue => {
    Animated.timing(animationValue.current, {
      toValue,
      duration,
      useNativeDriver
    }).start();
  };

  return { animationValue, animateTo };
}

export function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}
