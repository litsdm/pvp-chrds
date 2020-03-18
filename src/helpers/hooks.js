import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

const initialAnimationOpts = {
  duration: 200,
  autoPlay: false,
  type: 'timing'
};

export function useAnimation(options = {}) {
  const finalOptions = { ...initialAnimationOpts, ...options };
  const { duration, autoPlay, delay, type } = finalOptions;
  const animationValue = useRef(new Animated.Value(0));

  const animateTo = toValue => {
    const opts = {
      toValue,
      duration,
      useNativeDriver: true
    };
    if (type === 'spring')
      Animated.spring(animationValue.current, opts).start();
    else Animated.timing(animationValue.current, opts).start();
  };

  if (autoPlay) {
    useEffect(() => {
      if (delay) setTimeout(() => animateTo(1), delay);
      else animateTo(1);
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

const initialCountOptions = {
  startAt: 3,
  onEnd: () => {},
  endAt: 0,
  operation: 'subtraction',
  duration: 1000
};

export function useCountdown(options = {}) {
  const finalOptions = { ...initialCountOptions, ...options };
  const { startAt, onEnd, endAt, operation, duration } = finalOptions;
  const [timeLeft, setTimeLeft] = useState(startAt);
  const addValue = duration * 0.001;
  let interval;

  useEffect(() => {
    interval = setInterval(() => {
      setTimeLeft(current => {
        const endCondition =
          operation === 'sum' ? current >= endAt : current <= endAt;
        if (endCondition) {
          clearInterval(interval);
          onEnd();
          return endAt;
        }

        return operation === 'sum' ? current + addValue : current - addValue;
      });
    }, duration);

    return () => clearInterval(interval);
  });

  return timeLeft;
}
