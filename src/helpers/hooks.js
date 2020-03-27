import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode';
import dayjs from 'dayjs';
import RelativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(RelativeTime);

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

const formatDiff = minutes => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes - 60 * hours;

  return `${hours < 10 ? '0' : ''}${hours}:${mins < 10 ? '0' : ''}${mins}`;
};

export function useDateCountdown(startDate, endDate, onEnd = () => {}) {
  const [countdown, setCountdown] = useState(
    formatDiff(endDate.diff(startDate, 'm'))
  );
  let interval;

  useEffect(() => {
    interval = setInterval(() => {
      setCountdown(() => {
        const now = dayjs();
        if (now.isAfter(endDate)) {
          const prevEndDate = dayjs(endDate.toString());
          clearInterval(interval);
          onEnd();
          return formatDiff(endDate.add(4, 'h').diff(prevEndDate, 'm'));
        }

        return formatDiff(endDate.diff(now, 'm'));
      });
    }, 60000);

    return () => clearInterval(interval);
  });

  return countdown;
}

export const useUserID = () => {
  const [userID, setUserID] = useState('');

  useEffect(() => {
    getUserID();
  }, []);

  const getUserID = async () => {
    const token = await AsyncStorage.getItem('CHRDS_TOKEN');
    const { _id } = jwtDecode(token);
    setUserID(_id);
  };

  return userID;
};
