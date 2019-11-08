import React from 'react';
import { Image, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import AnimatedCircle from '../components/AnimatedCircle';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.statusBar} />
      <View style={styles.header}>
        <AnimatedCircle
          color="#7C4DFF"
          size={152}
          animationType="position-opacity"
          endPosition={{ y: 152 - 152 / 4, x: -152 + 152 / 3 }}
          circleStyle={{ right: -152, top: -152 }}
        />
        <AnimatedCircle
          color="#FFC107"
          size={115}
          animationType="position-opacity"
          delay={150}
          endPosition={{ y: 115 - 115 / 3.5, x: 0 }}
          circleStyle={{ top: -115, right: 42 }}
        />
        <AnimatedCircle
          color="#FF5252"
          size={90}
          animationType="position-opacity"
          delay={300}
          endPosition={{ y: 90 - 90 / 1.8, x: 0 }}
          circleStyle={{ top: -90, left: 42 }}
          empty
        />
        <View style={styles.leftSide}>
          <Text style={styles.greeting}>Hello Pam,</Text>
          <Text style={styles.subtitle}>Ready to Play?</Text>
        </View>
        <View style={styles.rightSide}>
          <TouchableOpacity style={styles.imgButton}>
            <Image
              resizeMode="cover"
              source={{ uri: 'https://thispersondoesnotexist.com/image' }}
              style={styles.profilePic}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: getStatusBarHeight()
  },
  statusBar: {
    backgroundColor: '#fff',
    height: getStatusBarHeight(),
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 5
  },
  header: {
    flexDirection: 'row'
  },
  leftSide: {
    flexBasis: '80%',
    flexDirection: 'column',
    paddingLeft: 24,
    paddingTop: 36
  },
  rightSide: {
    alignItems: 'flex-end',
    flexBasis: '20%',
    paddingRight: 24,
    paddingTop: 36
  },
  greeting: {
    fontFamily: 'sf-bold',
    fontSize: 30,
    fontWeight: 'bold'
  },
  subtitle: {
    fontFamily: 'sf-thin',
    fontSize: 18,
    fontWeight: '100'
  },
  imgButton: {
    height: 42,
    width: 42
  },
  profilePic: {
    borderRadius: 42 / 2,
    height: 42,
    width: 42
  }
});

export default HomeScreen;
