import React, { useEffect, useState, useRef } from 'react';
import { AsyncStorage, ScrollView } from 'react-native';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import Fuse from 'fuse.js';
import jwtDecode from 'jwt-decode';
import { func, string } from 'prop-types';

import GET_DATA from '../../graphql/queries/getPlayPopupData';
import CREATE_MATCH from '../../graphql/mutations/createMatch';

import callApi from '../../helpers/apiCaller';

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
  keys: ['username']
};

const PlayPopup = ({
  close,
  category,
  friend,
  navigate,
  openAdd,
  openPurchase
}) => {
  const [getData, { data }] = useLazyQuery(GET_DATA);
  const [createMatch, { data: matchData }] = useMutation(CREATE_MATCH);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [selectedFriend, setSelectedFriend] = useState(friend);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(category ? 1 : 0);
  const [categoryHash, setCategoryHash] = useState({});
  const scrollView = useRef(null);

  const friends = data ? data.friends : [];
  const { categories, user } = data || {};

  const fuse = new Fuse(friends, fuzzyOptions);
  const results = fuse.search(search);

  useEffect(() => {
    fetchFriends();
  }, []);

  useEffect(() => {
    if (user && Object.keys(categoryHash).length === 0) {
      const hash = {};
      user.categories.forEach(cat => {
        hash[cat] = true;
      });
      setCategoryHash(hash);
    }
  }, [user]);

  useEffect(() => {
    scrollPage();
  }, [page]);

  useEffect(() => {
    if (matchData && matchData.match) navigateOnDone();
  }, [matchData]);

  const fetchFriends = async () => {
    const token = await AsyncStorage.getItem('CHRDS_TOKEN');
    const { _id } = jwtDecode(token);
    getData({ variables: { _id } });
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

  const fetchRandomOpponent = async () => {
    try {
      const response = await callApi(`randomOpponent?userID=${user._id}`);
      const { opponent } = await response.json();
      return opponent;
    } catch (exception) {
      // display badge
    }
  };

  const handleDone = async () => {
    let finalCategory = selectedCategory;
    let opponent = selectedFriend;
    if (selectedCategory === '-1') {
      const randomIndex = Math.floor(Math.random() * categories.length);
      finalCategory = categories[randomIndex]._id;
      await setSelectedCategory(finalCategory);
    }
    if (selectedFriend === '-1') {
      opponent = await fetchRandomOpponent();
      await setSelectedFriend(opponent);
    }

    if (!opponent) return;

    const variables = {
      players: [user._id, opponent],
      category: finalCategory,
      turn: user._id,
      score: JSON.stringify({ [user._id]: 0, [opponent]: 0 })
    };

    await createMatch({ variables });
  };

  const navigateOnDone = () => {
    navigate('Camera', {
      categoryID: selectedCategory,
      opponentID: selectedFriend,
      matchID: matchData.match._id,
      userID: user._id
    });
    close();
  };

  const handleOpenPurchase = dataCategory => () => {
    const openData = { category: dataCategory, user };
    openPurchase(openData);
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
          categories={categories || []}
          directPlay={friend !== null}
          handleDone={handleDone}
          categoryHash={categoryHash}
          openPurchase={handleOpenPurchase}
        />
        <SelectFriend
          handleDone={handleDone}
          friends={results.length > 0 ? results : friends}
          onChangeText={handleTextChange}
          selected={selectedFriend}
          select={selectFriend}
          search={search}
          openAdd={openAdd}
        />
      </ScrollView>
    </Popup>
  );
};

PlayPopup.propTypes = {
  close: func.isRequired,
  navigate: func.isRequired,
  openAdd: func.isRequired,
  openPurchase: func.isRequired,
  category: string,
  friend: string
};

PlayPopup.defaultProps = {
  category: null,
  friend: null
};

export default PlayPopup;
