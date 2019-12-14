import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { bool, number } from 'prop-types';

import MedalIcon from '../../../assets/icons/ribbon.svg';
import EmptyMedalIcon from '../../../assets/icons/emptyMedal.svg';

import { useAnimation } from '../../helpers/hooks';

const Medal = ({ empty }) => {
  const { animationValue } = useAnimation({ autoPlay: true });

  const animation = {
    opacity: animationValue.current.interpolate({
      inputRange: [0, 0.25],
      outputRange: [0, 1]
    }),
    transform: [
      {
        scale: animationValue.current.interpolate({
          inputRange: [0, 1],
          outputRange: [1.25, 1]
        })
      }
    ]
  };

  return (
    <Animated.View style={[styles.medal, animation]}>
      {empty ? (
        <EmptyMedalIcon width={60} height={60} />
      ) : (
        <MedalIcon width={60} height={60} />
      )}
    </Animated.View>
  );
};

const Medals = ({ medalCount }) => {
  const [medals, setMedals] = useState([]);

  useEffect(() => {
    let timeout;

    if (medals.length !== 3) {
      const medal = (
        <Medal key={medals.length} empty={medals.length >= medalCount} />
      );
      timeout = setTimeout(setMedals([...medals, medal]), 400);
    }

    return () => clearTimeout(timeout);
  }, [medals]);

  return <View style={styles.container}>{medals}</View>;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 24
  }
});

Medal.propTypes = {
  empty: bool.isRequired
};

Medals.propTypes = {
  medalCount: number.isRequired
};

export default Medals;
