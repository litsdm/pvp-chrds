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
          uri="https://feather-static.s3-us-west-2.amazonaws.com/chrds-logo.png"
          subtitle="Lorem ipsum dolor sit amet. lorem ipsum."
        />
        <Section
          title="Second point!"
          uri="https://feather-static.s3-us-west-2.amazonaws.com/chrds-logo.png"
          subtitle="Lorem ipsum dolor sit amet. lorem ipsum."
        />
        <Section
          title="Third Point!"
          uri="https://feather-static.s3-us-west-2.amazonaws.com/chrds-logo.png"
          subtitle="Lorem ipsum dolor sit amet. lorem ipsum."
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
    marginBottom: 12,
    textAlign: 'center'
  },
  subtitle: {
    fontFamily: 'sf-regular',
    fontSize: 18,
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
