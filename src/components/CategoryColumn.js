import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { bool, func, object, string } from 'prop-types';

import Layout from '../constants/Layout';

const CategoryColumn = ({
  name,
  description,
  image,
  color,
  onPress,
  onPressInner,
  selecting,
  selected,
  logoRef,
  hideLogo
}) => {
  const [logoOpacity, setLogoOpacity] = useState(1);

  useEffect(() => {
    if (!hideLogo && logoOpacity !== 1) setLogoOpacity(1);
    else if (hideLogo) setLogoOpacity(0);
  }, [hideLogo]);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View
        style={[styles.bg, { backgroundColor: selected ? '#4CD964' : color }]}
      >
        <View style={styles.cut}>
          <View
            style={[
              styles.corner,
              { backgroundColor: selected ? '#4CD964' : color }
            ]}
          />
        </View>
      </View>
      <View
        style={[styles.imageWrapper, { opacity: logoOpacity }]}
        ref={logoRef}
      >
        {selected ? (
          <View style={styles.overlay}>
            <Ionicons color="#4CD964" size={42} name="ios-checkmark" />
          </View>
        ) : null}
        {image ? (
          <Image source={{ uri: image }} style={styles.logo} />
        ) : (
          <View style={[styles.logo, { backgroundColor: color }]}>
            <Ionicons size={42} name="ios-shuffle" color="#fff" />
          </View>
        )}
      </View>
      <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
        {name}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {description}
      </Text>
      {selecting ? (
        <TouchableOpacity
          style={styles.button}
          onPress={selecting ? onPress : onPressInner}
        >
          <Text style={styles.buttonText}>
            {selected ? 'Selected' : 'Select'}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={selecting ? onPress : onPressInner}
        >
          <Text style={styles.buttonText}>Play</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 12,
    paddingTop: 0,
    overflow: 'hidden',
    marginHorizontal: 12,
    width: Layout.window.width / 2.3
  },
  imageWrapper: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    height: 72,
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: 72
  },
  logo: {
    alignItems: 'center',
    borderRadius: 12,
    height: 66,
    justifyContent: 'center',
    width: 66
  },
  name: {
    color: '#fff',
    fontFamily: 'sf-bold',
    fontSize: 16,
    marginBottom: 12
  },
  description: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'sf-light',
    fontSize: 12,
    marginBottom: 12
  },
  button: {
    alignItems: 'center',
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    padding: 6,
    width: '100%'
  },
  buttonText: {
    color: '#fff'
  },
  bg: {
    backgroundColor: '#F2555A',
    borderRadius: 18,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  },
  cut: {
    backgroundColor: '#fff',
    height: 100,
    position: 'absolute',
    top: -100 + 31,
    right: 6,
    transform: [
      {
        rotate: '-25deg'
      }
    ],
    width: Layout.window.width / 2
  },
  corner: {
    backgroundColor: '#F2555A',
    borderRadius: 18,
    bottom: -48,
    left: -8,
    height: 48,
    position: 'absolute',
    width: 70,
    transform: [
      {
        rotate: '25deg'
      }
    ]
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1
  }
});

CategoryColumn.propTypes = {
  name: string.isRequired,
  description: string.isRequired,
  image: string,
  color: string.isRequired,
  onPress: func.isRequired,
  onPressInner: func,
  selecting: bool,
  selected: bool,
  logoRef: object,
  hideLogo: bool
};

CategoryColumn.defaultProps = {
  onPressInner: () => {},
  selecting: false,
  selected: false,
  image: '',
  logoRef: null,
  hideLogo: false
};

export default CategoryColumn;
