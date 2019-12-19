import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { func, number, string } from 'prop-types';

import Modal from '../Modal';

const PurchaseModal = ({ close, coins, powerup, handlePurchase }) => {
  const getInfo = () => {
    switch (powerup) {
      case 'bomb':
        return {
          title: 'Bomb Power-Up',
          description: 'Blows up all unecessary letters for 50 coins.',
          icon: 'bomb',
          cost: 50
        };
      case 'hourglass':
        return {
          title: 'Hourglass Power-Up',
          description:
            'Slows down the countdown giving you more time to think up the right answer for only 30 coins.',
          icon: 'hourglass-half',
          cost: 30
        };
      case 'hint':
        return {
          title: 'Hint Power-Up',
          description:
            'Gives you a hint about the word that you need to guess. Only costs 10 coins!',
          icon: 'info-circle',
          cost: 10
        };
      case 'fill':
        return {
          title: 'Fill Power-Up',
          description: 'Fills 2 random letters for you for 70 coins',
          icon: 'fill-drip',
          cost: 70
        };
      default:
        return {};
    }
  };

  const { title, icon, description, cost } = getInfo();

  return (
    <Modal close={close}>
      <View style={styles.container}>
        <View style={styles.titleWrapper}>
          <FontAwesome5 name={icon} size={24} color="#000" />
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.costWrapper}>
          <Text style={styles.cost}>
            <Text style={styles.costLabel}>Cost: </Text>
            {cost}
          </Text>
          <FontAwesome5 name="coins" size={18} color="#FFC107" />
        </View>
        {coins >= cost ? (
          <View style={styles.purchaseFooter}>
            <TouchableOpacity
              style={styles.button}
              onPress={handlePurchase(cost)}
            >
              <Text style={styles.yesText}>Buy Item</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={close}>
              <Text style={styles.noText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.getMoreFooter}>
            <Text style={styles.notEnoughText}>
              You have {coins} coins and this item costs {cost} coins. Get more
              now to buy this item.
            </Text>
            <TouchableOpacity style={styles.getMore}>
              <Text style={styles.getMoreText}>Get More</Text>
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
  titleWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
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
  purchaseFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%'
  },
  button: {
    padding: 12
  },
  yesText: {
    color: '#7c4dff',
    fontFamily: 'sf-medium',
    fontSize: 16
  },
  noText: {
    color: 'rgba(0,0,0,0.7)',
    fontFamily: 'sf-medium',
    fontSize: 16
  },
  notEnoughText: {
    color: 'rgba(0,0,0,0.6)',
    fontFamily: 'sf-light',
    textAlign: 'center'
  },
  getMoreFooter: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  getMore: {
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#7C4DFF',
    justifyContent: 'center',
    paddingVertical: 3,
    marginTop: 6,
    width: '80%'
  },
  getMoreText: {
    fontFamily: 'sf-medium',
    color: '#fff'
  }
});

PurchaseModal.propTypes = {
  close: func.isRequired,
  coins: number.isRequired,
  powerup: string.isRequired,
  handlePurchase: func.isRequired
};

export default PurchaseModal;
