import React, { useEffect, useState, useRef } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { Ionicons } from '@expo/vector-icons';
import { getDeviceId } from 'react-native-device-info';
import { object } from 'prop-types';

import GET_DATA from '../graphql/queries/getFFAData';

import Row from '../components/FFAMatchRow';

import Layout from '../constants/Layout';

const deviceID = getDeviceId();
const IS_IPHONE_X =
  deviceID.includes('iPhone12') || deviceID.includes('iPhone11');

const FFAScreen = ({ navigation }) => {
  const userID = navigation.getParam('userID', '');
  const { data } = useQuery(GET_DATA);
  const [didScroll, setDidScroll] = useState(false);
  const [rows, setRows] = useState(null);
  const [midIndex, setMidIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(1);
  const scrollView = useRef(null);

  const matches = data ? data.matches : [];

  useEffect(() => {
    if (data && data.matches) {
      const initialMatches =
        data.matches.length > 2
          ? [data.matches[matches.length - 1], data.matches[0], data.matches[1]]
          : data.matches;
      const index = data.matches.length < 3 ? 0 : 1;
      setActiveIndex(index);
      createRows(initialMatches, index);
    }
  }, [data]);

  const createRows = (matchs, overrideIndex = null) => {
    const matchRows = matchs.map(({ _id, video, category, sender }, index) => (
      <Row
        uri={video}
        active={
          overrideIndex !== null
            ? index === overrideIndex
            : index === activeIndex
        }
        username={sender.displayName}
        categoryName={category.name}
        key={_id}
      />
    ));
    setRows(matchRows);
  };

  const handleInitialSizeChange = (contentWidth, contentHeight) => {
    if (!didScroll && contentHeight !== 0 && data.matches.length > 2) {
      scrollView.current.scrollTo({
        x: 0,
        y: Layout.window.height,
        animated: false
      });
      setDidScroll(true);
    }
  };

  const handleScrollEnd = ({
    nativeEvent: {
      contentOffset: { y }
    }
  }) => {
    const newIndex = y === 0 ? 0 : y / Layout.window.height;
    const matchesLen = matches.length;
    let newMatches = [];
    let useIndex;

    if (data.matches.length === 1) return;

    if (data.matches.length === 2) {
      createRows(data.matches, newIndex);
      return;
    }

    if (newIndex === 2) {
      useIndex = midIndex === matchesLen - 1 ? 0 : midIndex + 1;
      newMatches = [
        matches[midIndex],
        matches[useIndex],
        matches[useIndex === matchesLen - 1 ? 0 : useIndex + 1]
      ];
    } else if (newIndex === 0) {
      useIndex = midIndex === 0 ? matchesLen - 1 : midIndex - 1;
      newMatches = [
        matches[useIndex === 0 ? matchesLen - 1 : useIndex - 1],
        matches[useIndex],
        matches[midIndex]
      ];
    }

    scrollView.current.scrollTo({
      x: 0,
      y: Layout.window.height,
      animated: false
    });

    setMidIndex(useIndex);

    createRows(newMatches);
  };

  const goBack = () => navigation.navigate('Home', { userID });

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="rgba(0,0,0,0)"
        barStyle="light-content"
        translucent
      />
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.back} onPress={goBack}>
          <Ionicons name="ios-arrow-round-back" color="#fff" size={30} />
        </TouchableOpacity>
      </View>
      <View style={{ height: '100%' }}>
        <ScrollView
          ref={scrollView}
          bounces={false}
          disableIntervalMomentum
          pagingEnabled
          decelerationRate="fast"
          snapToAlignment="start"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={handleInitialSizeChange}
          onMomentumScrollEnd={handleScrollEnd}
        >
          {rows}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2f2f2f',
    flex: 1
  },
  navbar: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 52,
    left: 0,
    paddingHorizontal: 24,
    paddingTop: IS_IPHONE_X ? 44 : 24,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 5
  }
});

FFAScreen.propTypes = {
  navigation: object.isRequired
};

export default FFAScreen;
