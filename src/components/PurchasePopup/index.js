import React, { useEffect, useState } from 'react';
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { useLazyQuery } from '@apollo/react-hooks';
import {
  connectAsync,
  disconnectAsync,
  purchaseItemAsync,
  getProductsAsync,
  IAPResponseCode,
  getBillingResponseCodeAsync
} from 'expo-in-app-purchases';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode';
import { func } from 'prop-types';

import GET_DATA from '../../graphql/queries/getPurchasePopupData';

import Popup from '../Popup';
import Tier from './Tier';
import Loader from '../Loader';

import { useAnimation } from '../../helpers/hooks';
import Layout from '../../constants/Layout';

import Crown from '../../../assets/icons/crown.svg';

const coins = [180, 80, 500, 1200];
const tierNames = ['Pro Monthly', 'Tier 1', 'Tier 2', 'Tier 3'];
const items = Platform.select({
  ios: [
    'dev.products.pro',
    'dev.products.coins_small',
    'dev.products.coins_medium',
    'dev.products.coins_large'
  ],
  android: ['pro_monthly', 'coins_small', 'coins_medium', 'coins_large']
});

const PurchasePopup = ({ close }) => {
  const [selected, setSelected] = useState(0);
  const [products, setProducts] = useState([]);
  const [getData, { data: userData }] = useLazyQuery(GET_DATA);
  const { animationValue, animateTo } = useAnimation({
    autoPlay: true,
    type: 'spring'
  });

  const user = userData ? userData.user : {};
  const data = products.length > 0 ? products : [];

  useEffect(() => {
    fetchData();
    connectIAP();
    return () => disconnectAsync();
  }, []);

  useEffect(() => {
    if (user && user.isPro) {
      setSelected(1);
    }
  }, [user]);

  const connectIAP = async () => {
    const code = await getBillingResponseCodeAsync();
    if (code === IAPResponseCode.ERROR) await connectAsync();

    let subscription;
    const otherIAP = [];
    const { responseCode, results } = await getProductsAsync(items);

    results.forEach(result => {
      if (result.productId.match(/dev.products.pro|pro_monthly/))
        subscription = result;
      else otherIAP.push(result);
    });
    otherIAP.sort((a, b) => a.priceAmountMicros - b.priceAmountMicros);
    if (responseCode === IAPResponseCode.OK)
      setProducts([subscription, ...otherIAP]);
  };

  const fetchData = async () => {
    const token = await AsyncStorage.getItem('CHRDS_TOKEN');
    const { _id } = jwtDecode(token);

    getData({ variables: { _id } });
  };

  const select = index => () => setSelected(index);

  const buyItem = async () => {
    const { productId } = products[selected];
    await purchaseItemAsync(productId);
  };

  const linkToTerms = () =>
    Linking.openURL('https://cdiezmoran.github.io/chrds-eula/');

  const formatPrice = price => (price.includes('.') ? price : `${price}.00`);

  const renderTiers = () =>
    data.reduce((result, { price, priceAmountMicros }, index) => {
      if (index === 0) return result;
      result.push(
        <Tier
          selected={index === selected}
          select={select(index)}
          cost={price}
          coins={coins[index]}
          name={tierNames[index]}
          index={index}
          key={priceAmountMicros}
        />
      );
      return result;
    }, []);

  const handleClose = () => {
    animateTo(0);
    setTimeout(() => close(), 200);
  };

  return (
    <Popup
      close={close}
      showsDragIndicator={false}
      animation={{ animationValue, animateTo }}
      avoidKeyboard={false}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="md-close" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Shop</Text>
        </View>
        <View style={styles.divider} />
        {data.length > 0 ? (
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <TouchableWithoutFeedback onPress={select(0)}>
              <View
                style={[
                  styles.subscription,
                  selected === 0 ? styles.selected : {}
                ]}
              >
                <Crown width={24} height={24} />
                <Text style={styles.subscTitle}>Charades Pro</Text>
                <View style={styles.benefits}>
                  <Text style={styles.benefit}>• 180 Coins monthly</Text>
                  <Text style={styles.benefit}>• Unlock all categories</Text>
                  <Text style={styles.benefit}>
                    • Submit your own word/category ideas
                  </Text>
                  <Text style={styles.benefit}>• Unlimited lives</Text>
                </View>
                <View style={styles.priceWrapper}>
                  <Text style={styles.subPrice}>
                    {formatPrice(data[0].price)}
                  </Text>
                  <Text style={styles.subpriceText}> per month</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback>
              <View style={{ width: '100%' }}>
                <View style={styles.divider} />
                <Text style={styles.subtitle}>Coins</Text>
                <View style={styles.tiers}>{renderTiers()}</View>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        ) : (
          <View style={styles.loading}>
            <Loader />
          </View>
        )}
        <View style={styles.divider} />
        <View style={styles.footer}>
          {selected === 0 ? (
            <TouchableOpacity
              style={[styles.button, user.isPro ? styles.disabled : {}]}
              onPress={buyItem}
              disabled={user.isPro}
            >
              {user.isPro ? (
                <Text style={styles.buttonText}>You are already Pro!</Text>
              ) : (
                <>
                  <Text style={styles.buttonText}>Buy Charades Pro</Text>
                  <Text style={styles.buttonSubtext}>
                    {data.length > 0 ? formatPrice(data[0].price) : ''} billed
                    monthly
                  </Text>
                </>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={buyItem}>
              <Text style={styles.buttonText}>
                Purchase {tierNames[selected]}
              </Text>
              <Text style={styles.buttonSubtext}>
                One time payment of{' '}
                {data.length > 0 ? formatPrice(data[selected].price) : ''}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.tosButton} onPress={linkToTerms}>
            <Text style={styles.tosText}>Terms of Service</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Popup>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: (Layout.window.height * 7) / 8
  },
  loading: {
    height: (Layout.window.height * 7) / 8
  },
  header: {
    alignItems: 'center',
    height: 52,
    justifyContent: 'center'
  },
  closeButton: {
    height: 24,
    left: 12,
    position: 'absolute',
    width: 24
  },
  title: {
    fontFamily: 'sf-bold',
    fontSize: 18
  },
  contentContainer: {
    padding: 12
  },
  subscription: {
    alignItems: 'center',
    borderColor: 'rgba(0,0,0,0.05)',
    borderWidth: 2,
    borderRadius: 8,
    justifyContent: 'center',
    paddingVertical: 12,
    marginBottom: 12
  },
  selected: {
    borderColor: '#7c4dff',
    backgroundColor: 'rgba(124,77,255,0.1)'
  },
  subscTitle: {
    fontFamily: 'sf-medium',
    fontSize: 16,
    marginBottom: 6
  },
  priceWrapper: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  subPrice: {
    fontFamily: 'sf-bold',
    fontSize: Platform.OS === 'ios' ? 18 : 14,
    marginTop: 12
  },
  subpriceText: {
    fontFamily: 'sf-light',
    fontSize: 10,
    opacity: 0.6
  },
  tiers: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%'
  },
  divider: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    height: 1,
    width: '100%'
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    paddingHorizontal: 12,
    marginBottom: Platform.OS !== 'ios' ? 36 : 12
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#7c4dff',
    borderRadius: 8,
    height: 54,
    justifyContent: 'center',
    width: '100%'
  },
  disabled: {
    backgroundColor: '#999'
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'sf-medium'
  },
  buttonSubtext: {
    color: '#fff',
    fontFamily: 'sf-light',
    fontSize: 12,
    opacity: 0.7
  },
  subtitle: {
    alignSelf: 'center',
    fontFamily: 'sf-medium',
    marginBottom: 6,
    marginTop: 12
  },
  tosButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 6 : 0
  },
  tosText: {
    fontFamily: 'sf-regular',
    fontSize: 12,
    opacity: 0.5,
    textDecorationLine: 'underline'
  }
});

PurchasePopup.propTypes = {
  close: func.isRequired
};

export default PurchasePopup;
