import React from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { bool, func, node, number, string } from 'prop-types';

import Layout from '../../constants/Layout';

import SmallCoins from '../../../assets/icons/smallCoins.svg';

const LifeTier = ({ select, selected, icon, title, price }) => (
  <TouchableWithoutFeedback onPress={select}>
    <View style={[styles.container, selected ? styles.selected : {}]}>
      <Text style={styles.title}>{title}</Text>
      {icon}
      <View style={styles.priceWrapper}>
        <Text style={styles.price}>{price}</Text>
        <SmallCoins height={14} width={14} />
      </View>
    </View>
  </TouchableWithoutFeedback>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    height: 180,
    width: Layout.window.width / 3 - 16
  },
  selected: {
    borderColor: '#7c4dff',
    backgroundColor: 'rgba(124,77,255,0.1)'
  },
  title: {
    fontFamily: 'sf-medium',
    fontSize: 16,
    marginBottom: 6,
    textAlign: 'center'
  },
  price: {
    fontFamily: 'sf-bold',
    fontSize: 14,
    marginRight: 6
  },
  priceWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 12
  }
});

LifeTier.propTypes = {
  select: func.isRequired,
  selected: bool.isRequired,
  icon: node.isRequired,
  title: string.isRequired,
  price: number.isRequired
};

export default LifeTier;
