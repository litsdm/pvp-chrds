import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import { FontAwesome5 } from '@expo/vector-icons';
import { arrayOf, func, number, shape, string } from 'prop-types';

import UPDATE_USER from '../graphql/mutations/updateUser';

import { analytics } from '../helpers/firebaseClients';

import Modal from './Modal';

const CategoryPurchase = ({ close, category, user, openStore }) => {
  const [updateUser] = useMutation(UPDATE_USER);

  const handlePurchase = async () => {
    const properties = JSON.stringify({
      categories: [...user.categories, category._id],
      coins: user.coins - category.price
    });

    await updateUser({ variables: { id: user._id, properties } });

    analytics.logSpendVirtualCurrency({
      item_name: 'category_unlock',
      value: category.price,
      virtual_currency_name: 'coins'
    });

    close();
  };

  return (
    <Modal close={close}>
      <View style={styles.container}>
        <Image source={{ uri: category.image }} style={styles.image} />
        <Text style={styles.title}>Purchase {category.name}</Text>
        <Text style={styles.description}>
          Unlock all the words in the {category.name} category forever for just{' '}
          {category.price} coins.
        </Text>
        <View style={styles.costWrapper}>
          <Text style={styles.cost}>
            <Text style={styles.costLabel}>Cost: </Text>
            {category.price}
          </Text>
          <FontAwesome5 name="coins" size={18} color="#FFC107" />
        </View>
        {category.price < user.coins ? (
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancel} onPress={close}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handlePurchase}>
              <Text style={styles.buttonText}>Purchase</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.neFooter}>
            <Text style={styles.neText}>
              You do not have enough coins. Click below to get more.
            </Text>
            <TouchableOpacity style={styles.button} onPress={openStore}>
              <Text style={styles.buttonText}>Get more coins</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24
  },
  title: {
    fontFamily: 'sf-bold',
    fontSize: 18,
    marginLeft: 12,
    textAlign: 'center'
  },
  description: {
    fontFamily: 'sf-regular',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center'
  },
  costWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  cost: {
    fontFamily: 'sf-medium',
    fontSize: 16,
    marginRight: 6,
    marginVertical: 12
  },
  costLabel: {
    fontFamily: 'sf-light',
    fontSize: 12
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#7c4dff',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'sf-medium'
  },
  cancel: {
    alignItems: 'center',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  cancelText: {
    color: '#000',
    fontFamily: 'sf-medium',
    opacity: 0.7
  },
  neFooter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6
  },
  neText: {
    fontFamily: 'sf-light',
    fontSize: 14,
    textAlign: 'center'
  }
});

CategoryPurchase.propTypes = {
  close: func.isRequired,
  category: shape({
    _id: string,
    name: string,
    price: number,
    image: string
  }).isRequired,
  user: shape({
    _id: string,
    coins: number,
    categories: arrayOf(string)
  }).isRequired,
  openStore: func.isRequired
};

export default CategoryPurchase;
