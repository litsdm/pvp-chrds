import React, { useEffect, useState, useRef } from 'react';
import { ScrollView } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { func } from 'prop-types';

import GET_CATEGORIES from '../../graphql/queries/getCategories';

import Popup from '../Popup';
import SelectCategory from './SelectCategory';
import SelectFriend from './SelectFriend';

import Layout from '../../constants/Layout';

const PlayPopup = ({ close }) => {
  const { data } = useQuery(GET_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [page, setPage] = useState(0);
  const scrollView = useRef(null);

  useEffect(() => {
    scrollPage();
  }, [page]);

  const scrollPage = () => {
    if (!scrollView.current) return;
    if (page === 0) scrollView.current.scrollTo({ x: 0, y: 0, animated: true });
    else
      scrollView.current.scrollTo({
        x: Layout.window.width,
        y: 0,
        animated: true
      });
  };

  const selectCategory = index => () => {
    if (index === selectedCategory) setSelectedCategory(null);
    else setSelectedCategory(index);
  };

  const handleNext = () => {
    if (selectedCategory === null) return;
    setPage(1);
  };

  const handleDone = () => {
    // create match
  };

  return (
    <Popup close={close}>
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
        <SelectCategory
          handleNext={handleNext}
          selectCategory={selectCategory}
          selectedCategory={selectedCategory}
          categories={data ? data.categories : []}
        />
        <SelectFriend handleDone={handleDone} />
      </ScrollView>
    </Popup>
  );
};

PlayPopup.propTypes = {
  close: func.isRequired
};

export default PlayPopup;
