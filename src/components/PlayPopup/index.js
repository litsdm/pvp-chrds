import React, { useEffect, useState, useRef } from 'react';
import { AsyncStorage, ScrollView } from 'react-native';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import Fuse from 'fuse.js';
import jwtDecode from 'jwt-decode';
import { func, string } from 'prop-types';

import GET_CATEGORIES from '../../graphql/queries/getCategories';
import GET_FRIENDS from '../../graphql/queries/getOnlyFriends';

import Popup from '../Popup';
import SelectCategory from './SelectCategory';
import SelectFriend from './SelectFriend';

import Layout from '../../constants/Layout';

const fuzzyOptions = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 3,
  keys: ['username', 'email']
};

const PlayPopup = ({ close, category }) => {
  const { data } = useQuery(GET_CATEGORIES);
  const [getFriends, { data: friendData }] = useLazyQuery(GET_FRIENDS);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(category ? 1 : 0);
  const scrollView = useRef(null);
  const friends = friendData ? friendData.friends : [];

  const fuse = new Fuse(friends, fuzzyOptions);
  const results = fuse.search(search);

  useEffect(() => {
    fetchFriends();
  }, []);

  useEffect(() => {
    scrollPage();
  }, [page]);

  const fetchFriends = async () => {
    const token = await AsyncStorage.getItem('CHRDS_TOKEN');
    const { _id } = jwtDecode(token);
    getFriends({ variables: { _id } });
  };

  const handleTextChange = text => setSearch(text);

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

  const selectFriend = _id => () => setSelectedFriend(_id);

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
        <SelectFriend
          handleDone={handleDone}
          friends={results.length > 0 ? results : friends}
          onChangeText={handleTextChange}
          selected={selectedFriend}
          select={selectFriend}
          search={search}
        />
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
