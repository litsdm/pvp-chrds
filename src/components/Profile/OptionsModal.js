import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { arrayOf, func, node, oneOfType, string } from 'prop-types';

import Modal from '../Modal';

import { useAnimation } from '../../helpers/hooks';

export const Option = ({ onPress, title, iconName, iconType }) => (
  <TouchableOpacity style={styles.row} onPress={onPress}>
    <View style={styles.iconWrapper}>
      {iconType === 'fa5' ? (
        <FontAwesome5 name={iconName} size={16} color="#000" />
      ) : (
        <Ionicons name={iconName} size={18} color="#000" />
      )}
    </View>
    <Text style={styles.rowText}>{title}</Text>
  </TouchableOpacity>
);

const OptionsModal = ({ close, children, title }) => {
  const { animationValue, animateTo } = useAnimation({ autoPlay: true });

  const handleClose = () => {
    animateTo(0);
    setTimeout(() => close(), 200);
  };

  return (
    <Modal
      style={styles.container}
      close={close}
      bgOpacity={0.4}
      animationValue={animationValue}
      animateTo={animateTo}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity style={styles.closeIcon} onPress={handleClose}>
            <Ionicons name="md-close" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
        {children}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    overflow: 'hidden',
    width: '100%'
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    paddingBottom: 0
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    width: '100%'
  },
  title: {
    fontFamily: 'sf-bold',
    fontSize: 14
  },
  closeIcon: {
    height: 24,
    position: 'absolute',
    right: 0,
    width: 24
  },
  divider: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    height: 1,
    width: '100%'
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 12,
    width: '100%'
  },
  rowText: {
    fontFamily: 'sf-medium',
    fontSize: 14,
    marginLeft: 6
  },
  iconWrapper: {
    alignItems: 'center',
    height: 24,
    justifyContent: 'center',
    width: 24
  }
});

OptionsModal.propTypes = {
  close: func.isRequired,
  title: string.isRequired,
  children: oneOfType([arrayOf(node), node]).isRequired
};

Option.propTypes = {
  onPress: func.isRequired,
  title: string.isRequired,
  iconName: string.isRequired,
  iconType: string
};

Option.defaultProps = {
  iconType: 'ion'
};

export default OptionsModal;
