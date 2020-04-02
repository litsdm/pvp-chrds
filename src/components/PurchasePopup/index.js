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
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
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
import UPDATE_USER from '../../graphql/mutations/updateUser';

import Popup from '../Popup';
import Tier from './Tier';
import LifeTier from './LifeTier';
import Loader from '../Loader';

import { useAnimation } from '../../helpers/hooks';
import Layout from '../../constants/Layout';

import Crown from '../../../assets/icons/crown.svg';
import Heart from '../../../assets/icons/heart.svg';
import Hearts from '../../../assets/icons/hearts.svg';
import Potion from '../../../assets/icons/potion.svg';

const livesData = [
  {
    title: '1 Life',
    price: 80,
    icon: <Heart height={42} width={42} />,
    buttonText: 'Buy 1 Life',
    addLives: 1
  },
  {
    title: '3 Lives',
    price: 180,
    icon: <Hearts height={42} width={42} />,
    buttonText: 'Buy 3 Lives',
    addLives: 3
  },
  {
    title: 'Replenish lives',
    price: 240,
    icon: <Potion height={42} width={42} />,
    buttonText: 'Replenish all your lives',
    addLives: -1
  }
];

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

const PurchasePopup = ({ close, displayBadge }) => {
  const [selected, setSelected] = useState(0);
  const [selectedLife, setSelectedLife] = useState(-1);
  const [products, setProducts] = useState([]);
  const [getData, { data: userData, refetch }] = useLazyQuery(GET_DATA);
  const [updateUser] = useMutation(UPDATE_USER);
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

  const select = index => () => {
    setSelected(index);
    if (selectedLife !== -1) setSelectedLife(-1);
  };

  const selectLife = index => () => {
    setSelectedLife(index);
    if (selected !== -1) setSelected(-1);
  };

  const buyLives = async () => {
    const life = livesData[selectedLife];
    const newLives = life.addLives === -1 ? 5 : user.lives + life.addLives;
    const newCoins = user.coins - life.price;
    const properties = JSON.stringify({ lives: newLives, coins: newCoins });

    try {
      await updateUser({ variables: { id: user._id, properties } });
      refetch();
      displayBadge('Purchase successful', 'success');
      handleClose();
    } catch (exception) {
      console.log(exception.message);
      displayBadge('There was an error procesing your purchase.', 'error');
    }
  };

  const buyItem = async () => {
    const { productId } = products[selected];
    await purchaseItemAsync(productId);
  };

  const linkToTerms = () =>
    Linking.openURL('https://cdiezmoran.github.io/chrds-eula/');

  const formatPrice = price => (price.includes('.') ? price : `${price}.00`);

  const getDisabledType = () => {
    const life = livesData[selectedLife];

    if (user.lives === 5) return 'You have the maximum number of lives';
    if (user.coins < life.price) return 'Not enough coins. Buy more above';
    if (user.lives + life.addLives > 5)
      return 'Lives would surpass the maximum';

    return null;
  };

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

  const renderLifeTiers = () =>
    livesData.map((life, index) => (
      <LifeTier
        key={life.title}
        select={selectLife(index)}
        selected={selectedLife === index}
        {...life}
      />
    ));

  const renderFoooterButton = () => {
    if (selected === 0) {
      return (
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
      );
    }

    if (selectedLife === -1) {
      return (
        <TouchableOpacity style={styles.button} onPress={buyItem}>
          <Text style={styles.buttonText}>Purchase {tierNames[selected]}</Text>
          <Text style={styles.buttonSubtext}>
            One time payment of{' '}
            {data.length > 0 ? formatPrice(data[selected].price) : ''}
          </Text>
        </TouchableOpacity>
      );
    }

    const life = livesData[selectedLife];
    const disabledType = getDisabledType();
    const isDisabled = disabledType !== null;

    return (
      <TouchableOpacity
        style={[styles.button, isDisabled ? styles.disabled : {}]}
        onPress={buyLives}
        disabled={isDisabled}
      >
        <Text style={styles.buttonText}>{life.buttonText}</Text>
        <Text style={styles.buttonSubtext}>
          {isDisabled ? disabledType : `Buy for ${life.price} in-game coins`}
        </Text>
      </TouchableOpacity>
    );
  };

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
            {!user.isPro ? (
              <TouchableWithoutFeedback>
                <View style={{ width: '100%' }}>
                  <View style={[styles.divider, { marginTop: 12 }]} />
                  <Text style={styles.subtitle}>Lives</Text>
                  <View style={styles.tiers}>{renderLifeTiers()}</View>
                </View>
              </TouchableWithoutFeedback>
            ) : null}
          </ScrollView>
        ) : (
          <View style={styles.loading}>
            <Loader />
          </View>
        )}
        <View style={styles.divider} />
        <View style={styles.footer}>
          {renderFoooterButton()}
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
  close: func.isRequired,
  displayBadge: func.isRequired
};

export default PurchasePopup;
