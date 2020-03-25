import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, Text, View } from 'react-native';
import { bool, func, number, string } from 'prop-types';

import Layout from '../../constants/Layout';

import SmallCoins from '../../../assets/icons/smallCoins.svg';
import MediumCoins from '../../../assets/icons/mediumCoins.svg';
import LargeCoins from '../../../assets/icons/largeCoins.svg';

const icons = [
  <SmallCoins width={24} height={24} />,
  <MediumCoins width={24} height={24} />,
  <LargeCoins width={36} height={36} />
];

const Tier = ({ select, coins, cost, selected, index, name }) => (
  <TouchableWithoutFeedback onPress={select}>
    <View style={[styles.container, selected ? styles.selected : {}]}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.coins}>{coins}</Text>
      {icons[index - 1]}
      <Text style={styles.cost}>
        {cost.includes('.') ? cost : `${cost}.00`}
      </Text>
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
    marginBottom: 6
  },
  coins: {
    color: '#FFC107',
    fontFamily: 'sf-bold',
    fontSize: 16,
    marginBottom: 3
  },
  cost: {
    fontFamily: 'sf-bold',
    fontSize: 14,
    marginTop: 12
  }
});

Tier.propTypes = {
  select: func.isRequired,
  selected: bool.isRequired,
  cost: string.isRequired,
  coins: number.isRequired,
  index: number.isRequired,
  name: string.isRequired
};

export default Tier;
