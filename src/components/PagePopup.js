import React, { useEffect, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  arrayOf,
  func,
  node,
  number,
  object,
  oneOfType,
  string
} from 'prop-types';

import { useAnimation } from '../helpers/hooks';

import Popup from './Popup';

import Layout from '../constants/Layout';

const PagePopup = ({
  children,
  close,
  back,
  title,
  page,
  containerStyle,
  animation
}) => {
  const { animationValue, animateTo } =
    animation || useAnimation({ type: 'spring' });
  const scrollView = useRef(null);

  useEffect(() => {
    scrollPage();
  }, [page]);

  const scrollPage = () => {
    if (!scrollView.current) return;
    if (page === 0) scrollView.current.scrollTo({ x: 0, y: 0, animated: true });
    else
      scrollView.current.scrollTo({
        x: Layout.window.width * page,
        y: 0,
        animated: true
      });
  };

  const handleClose = () => {
    animateTo(0);
    setTimeout(() => close(), 200);
  };

  return (
    <Popup
      close={close}
      animation={{ animationValue, animateTo }}
      showsDragIndicator={false}
    >
      <View style={[containerStyle || styles.container]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={page !== 0 && back ? back : handleClose}
          >
            <Ionicons
              name={page !== 0 && back ? 'md-arrow-round-back' : 'md-close'}
              size={24}
              color="#000"
            />
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.divider} />
        <ScrollView
          ref={scrollView}
          horizontal
          scrollEnabled={false}
          decelerationRate="fast"
          snapToAlignment="start"
          snapToInterval={Layout.window.width}
          bounces={false}
          disableIntervalMomentum
          disableScrollViewPanResponder
        >
          {children}
        </ScrollView>
      </View>
    </Popup>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: (Layout.window.height * 3) / 4
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
  divider: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    height: 1,
    width: '100%'
  }
});

PagePopup.propTypes = {
  close: func.isRequired,
  children: oneOfType([arrayOf(node), node]),
  back: func,
  title: string.isRequired,
  page: number.isRequired,
  containerStyle: object,
  animation: object
};

PagePopup.defaultProps = {
  children: null,
  back: null,
  containerStyle: null,
  animation: null
};

export default PagePopup;
