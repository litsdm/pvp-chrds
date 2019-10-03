import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

const initialAnimationOpts = {
  duration: 100,
  autoPlay: false
};

export function useAnimation(options = {}) {
  const finalOptions = { ...initialAnimationOpts, ...options };
  const { duration, autoPlay } = finalOptions;
  const animationValue = useRef(new Animated.Value(0));

  const animateTo = toValue => {
    Animated.timing(animationValue.current, {
      toValue,
      duration,
      useNativeDriver: true
    }).start();
  };

  if (autoPlay) {
    useEffect(() => {
      animateTo(1);
    }, []);
  }

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

export function useCountdown(count = 3, onEnd = () => {}) {
  const [timeLeft, setTimeLeft] = useState(count);
  let interval;

  useEffect(() => {
    interval = setInterval(() => {
      setTimeLeft(current => {
        if (current <= 1) {
          clearInterval(interval);
          onEnd();
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  });

  return timeLeft;
}
