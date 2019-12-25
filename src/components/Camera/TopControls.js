import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { bool, func, number, object, string } from 'prop-types';

const TopControls = ({
  goBack,
  uri,
  username,
  userScore,
  opponentScore,
  iconName,
  preventBack,
  category
}) => (
  <View style={styles.container}>
    <LinearGradient
      style={styles.gradient}
      colors={['rgba(0, 0, 0, 0.5)', 'transparent']}
      pointerEvents="none"
    />
    <View style={styles.content}>
      <View style={styles.left}>
        {!preventBack ? (
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Ionicons name={iconName} color="#fff" size={30} />
          </TouchableOpacity>
        ) : (
          <View style={styles.buttonPlaceholder} />
        )}
        {category && category.image ? (
          <>
            <Image
              source={{ uri: category.image }}
              style={styles.categoryImage}
            />
            <Text
              style={styles.categoryName}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {category.name}
            </Text>
          </>
        ) : null}
      </View>
      <View style={styles.info}>
        <View style={styles.opponent}>
          <Image source={{ uri }} style={styles.profilePic} />
          <Text style={styles.username} numberOfLines={1} ellipsizeMode="tail">
            {username}
          </Text>
        </View>
        <View style={styles.verticalDivider} />
        <View style={styles.scoreWrapper}>
          <Text style={styles.score}>
            {userScore} - {opponentScore}
          </Text>
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    height: '50%',
    left: 0,
    paddingHorizontal: 24,
    paddingTop: getStatusBarHeight() + 6,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 2
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  gradient: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  },
  left: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexBasis: '50%'
  },
  info: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexBasis: '50%'
  },
  opponent: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  profilePic: {
    borderRadius: 24 / 2,
    height: 24,
    marginRight: 6,
    width: 24
  },
  categoryImage: {
    borderRadius: 6,
    height: 24,
    marginLeft: 8,
    marginRight: 6,
    width: 24
  },
  username: {
    color: '#fff',
    fontFamily: 'sf-medium'
  },
  score: {
    color: '#fff',
    fontFamily: 'sf-medium'
  },
  verticalDivider: {
    backgroundColor: '#fff',
    height: 16,
    marginHorizontal: 12,
    width: 1
  },
  buttonPlaceholder: {
    backgroundColor: 'transparent',
    height: 30,
    width: 30
  },
  categoryName: {
    color: '#fff',
    fontFamily: 'sf-light',
    maxWidth: '70%'
  }
});

TopControls.propTypes = {
  goBack: func.isRequired,
  uri: string,
  username: string,
  userScore: number,
  opponentScore: number,
  iconName: string.isRequired,
  preventBack: bool,
  category: object
};

TopControls.defaultProps = {
  uri: '?',
  username: '',
  userScore: 0,
  opponentScore: 0,
  preventBack: false,
  category: null
};

export default TopControls;
