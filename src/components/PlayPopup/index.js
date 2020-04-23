import React, { useEffect, useState, useRef } from 'react';
import { ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import Fuse from 'fuse.js';
import jwtDecode from 'jwt-decode';
import { func, string } from 'prop-types';

import GET_DATA from '../../graphql/queries/getPlayPopupData';
import UPDATE_USER from '../../graphql/mutations/updateUser';
import CREATE_MATCH from '../../graphql/mutations/createMatch';

import callApi from '../../helpers/apiCaller';
import { analytics } from '../../helpers/firebaseClients';

import Popup from '../Popup';
import SelectCategory from './SelectCategory';
import SelectFriend from './SelectFriend';
import SelectMode from './SelectMode';

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
  mode,
  friend,
  navigate,
  openAdd,
  openPurchase,
  openProModal,
  openShop
}) => {
  const modeNumber = mode === 'versus' ? 1 : 0;
  const [getData, { data }] = useLazyQuery(GET_DATA);
  const [createMatch, { data: matchData }] = useMutation(CREATE_MATCH);
  const [updateUser] = useMutation(UPDATE_USER);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [selectedFriend, setSelectedFriend] = useState(friend);
  const [selectedMode, setSelectedMode] = useState(friend ? 1 : modeNumber);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(friend || mode ? 1 : 0);
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
    scrollView.current.scrollTo({
      x: Layout.window.width * page,
      y: 0,
      animated: true
    });
  };

  const selectCategory = _id => () => {
    if (_id === selectedCategory) setSelectedCategory(null);
    else setSelectedCategory(_id);
  };

  const selectFriend = _id => () => setSelectedFriend(_id);
  const selectMode = newMode => () => setSelectedMode(newMode);

  const handleNext = () => {
    if (selectedCategory === null) return;
    setPage(2);
  };

  const handleModeNext = () => {
    if (category !== null) setPage(2);
    else setPage(1);
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
    if (selectedMode === 0) handleFFADone();
    else handleVersusDone();
  };

  const handleVersusDone = async () => {
    const finalCategory = getFinalCategory();
    let opponent = selectedFriend;

    if (!user.isPro && user.lives <= 0) {
      openProModal();
      return;
    }

    if (selectedFriend === '-1') {
      opponent = await fetchRandomOpponent();
      setSelectedFriend(opponent);
    }

    if (!opponent) return;

    const variables = {
      players: [user._id, opponent],
      category: finalCategory,
      turn: user._id,
      score: JSON.stringify({ [user._id]: 0, [opponent]: 0 })
    };

    const properties = JSON.stringify({ lives: user.lives - 1 });

    analytics.logEvent('match_create_versus', {
      category: finalCategory,
      friend: opponent,
      isRandom: selectedFriend === '-1'
    });

    await updateUser({ variables: { id: user._id, properties } });
    await createMatch({ variables });
  };

  const handleFFADone = async () => {
    const finalCategory = getFinalCategory();

    analytics.logEvent('play_select_ffa', {
      category: finalCategory
    });

    navigate('Camera', {
      categoryID: finalCategory,
      userID: user._id,
      mode: 'ffa'
    });
    close();
  };

  const getFinalCategory = () => {
    let finalCategory = selectedCategory;
    if (selectedCategory === '-1') {
      const randomIndex = Math.floor(Math.random() * user.categories.length);
      finalCategory = user.categories[randomIndex];
      setSelectedCategory(finalCategory);
    }
    return finalCategory;
  };

  const navigateOnDone = () => {
    navigate('Camera', {
      categoryID: selectedCategory,
      opponentID: selectedFriend,
      matchID: matchData.match._id,
      userID: user._id,
      mode: 'versus'
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
        <SelectMode
          handleNext={handleModeNext}
          selectMode={selectMode}
          selected={selectedMode}
          handlePlay={handleDone}
          didSelectCategory={category !== null}
        />
        <SelectCategory
          handleNext={handleNext}
          selectCategory={selectCategory}
          selectedCategory={selectedCategory}
          categories={categories || []}
          directPlay={friend !== null || selectedMode === 0}
          handleDone={handleDone}
          categoryHash={categoryHash}
          isPro={user ? user.isPro : false}
          openPurchase={handleOpenPurchase}
          openShop={openShop}
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
  openProModal: func.isRequired,
  category: string,
  friend: string,
  mode: string,
  openShop: func.isRequired
};

PlayPopup.defaultProps = {
  category: null,
  friend: null,
  mode: null
};

export default PlayPopup;
