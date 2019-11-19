import React from 'react';
import { Image, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { bool, func, string } from 'prop-types';

import Layout from '../constants/Layout';

const CategoryColumn = ({
  name,
  description,
  onPress,
  onPressInner,
  selecting,
  selected
}) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    <View style={styles.bg}>
      <View style={styles.cut}>
        <View style={styles.corner} />
      </View>
    </View>
    <View style={styles.imageWrapper}>
      <Image
        source={{
          uri:
            'https://feather-static.s3-us-west-2.amazonaws.com/chrds-logo-bg.jpeg'
        }}
        style={styles.logo}
      />
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
    borderRadius: 12,
    height: 66,
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
    ],
  }
});

CategoryColumn.propTypes = {
  name: string.isRequired,
  description: string.isRequired,
  onPress: func.isRequired,
  onPressInner: func,
  selecting: bool,
  selected: bool
};

CategoryColumn.defaultProps = {
  onPressInner: () => {},
  selecting: false,
  selected: false
};

export default CategoryColumn;
