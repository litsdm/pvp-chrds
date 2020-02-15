import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { func, string } from 'prop-types';

import FFAIcon from '../../assets/icons/ffa.svg';

import Layout from '../constants/Layout';

import expandAnimation from '../../assets/animations/expand.json';

const FFARow = ({ position, onPress }) => {
  const [expanded, setExpanded] = useState(true);
  const expandAnimationRef = useRef(null);

  useEffect(() => {
    expandAnimationRef.current.play(90, 91);
  }, []);

  const positionStyles = () => {
    if (position === 'FirstLast')
      return { borderBottomWidth: 1, borderTopWidth: 1 };
    if (position === 'First') return { borderTopWidth: 1 };
    if (position === 'Last') return { borderBottomWidth: 1 };
  };

  const handleExpand = () => {
    if (expanded) expandAnimationRef.current.play(170, 180);
    else expandAnimationRef.current.play(65, 85);
    setExpanded(!expanded);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.container, positionStyles()]}
        onPress={onPress}
      >
        <View style={styles.content}>
          <View style={styles.left}>
            <View style={styles.iconWrapper}>
              <FFAIcon height={48} width={48} />
            </View>
            <View style={styles.info}>
              <Text style={styles.title}>Free for All</Text>
              {expanded ? (
                <Text style={styles.description}>
                  Guess the act of anyone in the Charades community.
                </Text>
              ) : null}
            </View>
          </View>
          <TouchableOpacity style={styles.expand} onPress={handleExpand}>
            <LottieView
              source={expandAnimation}
              ref={expandAnimationRef}
              loop={false}
              style={styles.animation}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
        {expanded ? <Text style={styles.play}>Press to Play</Text> : null}
      </TouchableOpacity>
      {position === 'Mid' || position === 'First' ? (
        <View style={styles.divider} />
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.04)',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  left: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  expand: {
    alignItems: 'center',
    height: 60,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 30
  },
  iconWrapper: {
    alignItems: 'center',
    borderRadius: 60 / 2,
    height: 60,
    justifyContent: 'center',
    marginRight: 12,
    width: 60
  },
  title: {
    fontFamily: 'sf-medium',
    fontSize: 16
  },
  info: {
    maxWidth: '70%'
  },
  description: {
    fontFamily: 'sf-regular',
    fontSize: 12,
    opacity: 0.4
  },
  play: {
    color: '#7c4dff',
    fontFamily: 'sf-medium',
    fontSize: 10
  },
  divider: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    bottom: 0,
    height: 1,
    position: 'absolute',
    right: 0,
    width: Layout.window.width - 96
  },
  animation: {
    height: 204,
    position: 'absolute'
  }
});

FFARow.propTypes = {
  position: string.isRequired,
  onPress: func.isRequired
};

export default FFARow;
