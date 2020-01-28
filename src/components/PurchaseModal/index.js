import React, { useEffect, useState } from 'react';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  View
} from 'react-native';
import {
  connectAsync,
  disconnectAsync,
  purchaseItemAsync,
  getProductsAsync,
  IAPResponseCode
} from 'expo-in-app-purchases';
import { Ionicons } from '@expo/vector-icons';
import { func } from 'prop-types';

import Modal from '../Modal';
import Tier from './Tier';

const coins = [80, 500, 1200];
const tierNames = ['Tier 1', 'Tier 2', 'Tier 3'];
const items = Platform.select({
  ios: [
    'dev.products.coins_small',
    'dev.products.coins_medium',
    'dev.products.coins_large'
  ],
  android: ['coins_small', 'coins_medium', 'coins_large']
});

const PurchaseModal = ({ close }) => {
  const [selected, setSelected] = useState(0);
  const [products, setProducts] = useState([]);

  const data = products.length > 0 ? products : [];
  if (products.length > 0) console.log(products);

  useEffect(() => {
    connectIAP();
    return () => disconnectAsync();
  }, []);

  const connectIAP = async () => {
    await connectAsync();
    const { responseCode, results } = await getProductsAsync(items);
    results.sort((a, b) => a.priceAmountMicros - b.priceAmountMicros);
    if (responseCode === IAPResponseCode.OK) setProducts(results);
  };

  const select = index => () => setSelected(index);

  const buyItem = async () => {
    const { productId } = products[selected];
    await purchaseItemAsync(productId);
  };

  const renderTiers = () =>
    data.map(({ price, priceAmountMicros }, index) => (
      <Tier
        selected={index === selected}
        select={select(index)}
        cost={price}
        coins={coins[index]}
        name={tierNames[index]}
        index={index}
        key={priceAmountMicros}
      />
    ));

  return (
    <Modal close={close}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.close} onPress={close}>
          <Ionicons name="ios-close" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Coin Shop</Text>
        <View style={styles.divider} />
        <View style={styles.tiers}>{renderTiers()}</View>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.button} onPress={buyItem}>
          <Text style={styles.buttonText}>Purchase {tierNames[selected]}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24
  },
  title: {
    fontFamily: 'sf-bold',
    fontSize: 18,
    textAlign: 'center'
  },
  tiers: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%'
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#7c4dff',
    borderRadius: 8,
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 24
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'sf-bold',
    fontSize: 16
  },
  divider: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    height: 1,
    width: '100%',
    marginVertical: 24
  },
  close: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 30 / 2,
    height: 30,
    justifyContent: 'center',
    position: 'absolute',
    right: 24,
    top: 24,
    width: 30
  }
});

PurchaseModal.propTypes = {
  close: func.isRequired
};

export default PurchaseModal;
