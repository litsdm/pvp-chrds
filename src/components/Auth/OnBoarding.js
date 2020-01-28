import React, { useState } from 'react';
import { Image, StyleSheet, ScrollView, Text, View } from 'react-native';
import { string } from 'prop-types';

import Layout from '../../constants/Layout';

const Section = ({ title, subtitle, uri }) => (
  <View style={styles.section}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>{subtitle}</Text>
    <Image source={{ uri }} style={styles.image} />
  </View>
);

Section.propTypes = {
  title: string.isRequired,
  subtitle: string.isRequired,
  uri: string.isRequired
};

const OnBoarding = () => {
  const [active, setActive] = useState(0);
  const handleScrollEnd = ({
    nativeEvent: {
      contentOffset: { x }
    }
  }) => {
    if (x >= 0 && x < Layout.window.width) setActive(0);
    else if (x >= Layout.window.width && x < Layout.window.width * 2)
      setActive(1);
    else if (x >= Layout.window.width * 2) setActive(2);
  };

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToAlignment="start"
        snapToInterval={Layout.window.width}
        bounces={false}
        disableIntervalMomentum
        disableScrollViewPanResponder
        onMomentumScrollEnd={handleScrollEnd}
      >
        <Section
          title="Welcome to CHRDS!"
          uri="https://chrds-static.s3-us-west-2.amazonaws.com/onBoarding-1-min.png?rand=123"
          subtitle="The game you alredy know now online. Sign up now to play with your friends."
        />
        <Section
          title="Multiple Categories!"
          uri="https://chrds-static.s3-us-west-2.amazonaws.com/onBoarding-2-min.png?rand=123"
          subtitle="Choose the category of your liking and play right away. More to come!"
        />
        <Section
          title="Guess your friend's act"
          uri="https://chrds-static.s3-us-west-2.amazonaws.com/onBoarding-3-min.png?rand=123"
          subtitle="And earn rewards that will take you to the next level."
        />
      </ScrollView>
      <View style={styles.indicators}>
        <View style={[styles.indicator, active === 0 ? styles.active : {}]} />
        <View style={[styles.indicator, active === 1 ? styles.active : {}]} />
        <View style={[styles.indicator, active === 2 ? styles.active : {}]} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    width: Layout.window.width
  },
  title: {
    fontFamily: 'sf-bold',
    fontSize: 24,
    marginBottom: 6,
    textAlign: 'center'
  },
  subtitle: {
    fontFamily: 'sf-light',
    fontSize: 16,
    textAlign: 'center',
    width: '80%'
  },
  image: {
    height: Layout.window.width / 2,
    width: Layout.window.width / 2
  },
  indicators: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 6,
    justifyContent: 'center',
    top: -30,
    width: '100%'
  },
  indicator: {
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    height: 6,
    marginRight: 24,
    width: 24
  },
  active: {
    backgroundColor: '#7c4dff',
    width: 30
  }
});

export default OnBoarding;
