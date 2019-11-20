import React, { useEffect, useState, useRef } from 'react';
import { ScrollView } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { func, string } from 'prop-types';

import GET_CATEGORIES from '../../graphql/queries/getCategories';

import Popup from '../Popup';
import SelectCategory from './SelectCategory';
import SelectFriend from './SelectFriend';

import Layout from '../../constants/Layout';

const PlayPopup = ({ close, category }) => {
  const { data } = useQuery(GET_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [page, setPage] = useState(category ? 1 : 0);
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

  const selectCategory = _id => () => {
    if (_id === selectedCategory) setSelectedCategory(null);
    else setSelectedCategory(_id);
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
  close: func.isRequired,
  category: string
};

PlayPopup.defaultProps = {
  category: null
};

export default PlayPopup;
