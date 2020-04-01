import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { func, string } from 'prop-types';

import Modal from './Modal';

import Crown from '../../assets/icons/crown.svg';

const ProModal = ({ close, openShop, type }) => {
  const iconAnimValue = useRef(new Animated.Value(0)).current;
  const titleAnimValue = useRef(new Animated.Value(0)).current;
  const descriptionAnimValue = useRef(new Animated.Value(0)).current;
  const dividerAnimValue = useRef(new Animated.Value(0)).current;
  const footerAnimValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const config = {
      toValue: 1,
      duration: 200,
      useNativeDriver: true
    };

    Animated.sequence([
      Animated.spring(iconAnimValue, { ...config, duration: 50 }),
      Animated.timing(titleAnimValue, config),
      Animated.timing(dividerAnimValue, config),
      Animated.timing(descriptionAnimValue, config),
      Animated.timing(footerAnimValue, config)
    ]).start();
  }, []);

  const animateOpacity = value => ({
    opacity: value.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    })
  });

  const animateScale = value => ({
    transform: [
      {
        scale: value.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1]
        })
      }
    ]
  });

  const iconAnimation = animateScale(iconAnimValue);
  const titleAnimation = animateOpacity(titleAnimValue);
  const descriptionAnimation = animateOpacity(descriptionAnimValue);
  const dividerAnimation = animateOpacity(dividerAnimValue);
  const footerAnimation = animateOpacity(footerAnimValue);

  const handleOpenStore = () => {
    openShop();
    close();
  };

  const getData = () => {
    if (type === 'lives')
      return {
        icon: 'heart',
        iconColor: '#FF5252',
        title: 'Get Unlimited Lives!',
        description:
          'Upgrade to Charades pro on the shop to get unlimited lives and many other pro benefits!'
      };

    return {
      icon: 'lightbulb',
      iconColor: '#FFC107',
      title: 'Create your own Words & Categories!',
      description:
        'Upgrade to charades pro to add your own words & categories to the game, plus many other benefits!'
    };
  };

  const { icon, iconColor, title, description } = getData();

  return (
    <Modal close={close}>
      <View style={styles.container}>
        <Animated.View style={[styles.iconAnim, iconAnimation]}>
          <FontAwesome5 size={24} name={icon} color={iconColor} solid />
        </Animated.View>
        <Animated.Text style={[styles.title, titleAnimation]}>
          {title}
        </Animated.Text>
        <Animated.View style={[styles.divider, dividerAnimation]} />
        <Animated.Text style={[styles.description, descriptionAnimation]}>
          {description}
        </Animated.Text>
        <Animated.View style={[styles.divider, dividerAnimation]} />
        <Animated.View style={[styles.footer, footerAnimation]}>
          <TouchableOpacity style={styles.button} onPress={handleOpenStore}>
            <Text style={styles.buttonText}>Upgrade to Pro</Text>
            <Crown width={18} height={18} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  titleWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 12
  },
  iconAnim: {
    alignSelf: 'center',
    height: 24,
    marginTop: 12,
    width: 24
  },
  title: {
    fontFamily: 'sf-bold',
    fontSize: 16,
    textAlign: 'center',
    padding: 12
  },
  divider: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    height: 1,
    width: '100%'
  },
  description: {
    fontFamily: 'sf-regular',
    fontSize: 14,
    padding: 12
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 12
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#7c4dff',
    borderRadius: 8,
    flexDirection: 'row',
    height: 54,
    justifyContent: 'center',
    width: '100%'
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'sf-medium',
    marginRight: 6
  }
});

ProModal.propTypes = {
  close: func.isRequired,
  openShop: func.isRequired,
  type: string.isRequired
};

export default ProModal;
