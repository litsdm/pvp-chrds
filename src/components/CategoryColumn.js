import React, { useEffect, useState } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  View
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { bool, func, number, object, string } from 'prop-types';

import Layout from '../constants/Layout';

import Crown from '../../assets/icons/crown.svg';

const Touchable =
  Platform.OS === 'ios' ? TouchableOpacity : TouchableWithoutFeedback;

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
  hideLogo,
  parentBackgroundColor,
  containerStyles,
  hasCategory,
  price,
  openPurchase,
  proOnly
}) => {
  const [logoOpacity, setLogoOpacity] = useState(1);

  useEffect(() => {
    if (!hideLogo && logoOpacity !== 1) setLogoOpacity(1);
    else if (hideLogo) setLogoOpacity(0);
  }, [hideLogo]);

  const renderButton = () => {
    if (!hasCategory) {
      return (
        <TouchableOpacity style={styles.button} onPress={openPurchase}>
          {proOnly ? (
            <>
              <Text style={styles.buttonText}>Pro Only</Text>
              <Crown height={16} width={16} style={{ marginLeft: 6 }} />
            </>
          ) : (
            <>
              <Text style={styles.buttonText}>Buy</Text>
              <FontAwesome5
                name="coins"
                size={16}
                color="#FFC107"
                style={styles.coins}
              />
              <Text style={styles.price}>{price}</Text>
            </>
          )}
        </TouchableOpacity>
      );
    }

    return selecting ? (
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
    );
  };

  return (
    <Touchable
      onPress={
        (selecting && hasCategory) || !selecting ? onPress : openPurchase
      }
    >
      <View style={[styles.container, containerStyles]}>
        <View
          style={[styles.bg, { backgroundColor: selected ? '#4CD964' : color }]}
        >
          <View
            style={[styles.cut, { backgroundColor: parentBackgroundColor }]}
          >
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
        {renderButton()}
      </View>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 12,
    paddingTop: 0,
    overflow: 'hidden',
    marginHorizontal: 12,
    width: Layout.window.width / 2 - 24
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
    flexDirection: 'row',
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
  },
  coins: {
    marginHorizontal: 4
  },
  price: {
    color: '#fff'
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
  hideLogo: bool,
  parentBackgroundColor: string,
  containerStyles: object,
  hasCategory: bool,
  price: number,
  openPurchase: func.isRequired,
  proOnly: bool.isRequired
};

CategoryColumn.defaultProps = {
  onPressInner: () => {},
  containerStyles: {},
  selecting: false,
  selected: false,
  image: '',
  logoRef: null,
  hideLogo: false,
  parentBackgroundColor: '#fff',
  hasCategory: true,
  price: 0
};

export default CategoryColumn;
