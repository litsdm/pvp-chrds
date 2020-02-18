import React, { useEffect, useState, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useQuery } from '@apollo/react-hooks';

import GET_DATA from '../graphql/queries/getFFAData';

import Row from '../components/FFAMatchRow';

import Layout from '../constants/Layout';

const FFAScreen = () => {
  const { data } = useQuery(GET_DATA);
  const [didScroll, setDidScroll] = useState(false);
  const [rows, setRows] = useState(null);
  const [midIndex, setMidIndex] = useState(0);
  const scrollView = useRef(null);

  const matches = data ? data.matches : [];

  useEffect(() => {
    if (data && data.matches) {
      const initialMatches = [
        data.matches[matches.length - 1],
        data.matches[0],
        data.matches[1]
      ];
      createRows(initialMatches);
    }
  }, [data]);

  const createRows = matchs => {
    const matchRows = matchs.map(({ _id, video, category }, index) => (
      <Row
        uri={video}
        active={index === 1}
        username="Carlos"
        categoryName={category.name}
        key={_id}
      />
    ));
    setRows(matchRows);
  };

  const handleInitialSizeChange = (contentWidth, contentHeight) => {
    if (!didScroll && contentHeight !== 0) {
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

  return (
    <View style={styles.container}>
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
  }
});

export default FFAScreen;
