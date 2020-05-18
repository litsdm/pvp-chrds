import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode';
import Fuse from 'fuse.js';
import dayjs from 'dayjs';
import { func, string } from 'prop-types';

import callApi from '../../helpers/apiCaller';
import { analytics } from '../../helpers/firebaseClients';

import Layout from '../../constants/Layout';

import GET_DATA from '../../graphql/queries/getPlayPopupData';
import UPDATE_USER from '../../graphql/mutations/updateUser';
import CREATE_MATCH from '../../graphql/mutations/createMatch';

import PagePopup from '../PagePopup';
import SelectMode from './SelectMode';
import SelectCategory from './SelectCategory';
import SelectFriend from './SelectFriend';
import Setup from './Setup';

const fuzzyOptions = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 3,
  keys: ['username']
};

const Page = {
  MODE: 0,
  CATEGORY: 1,
  FRIEND: 2
};

const PlayPopup = ({
  close,
  category,
  friend,
  mode,
  openShop,
  openPurchase,
  navigate,
  openAdd,
  openProModal
}) => {
  const [getData, { data }] = useLazyQuery(GET_DATA);
  const [createMatch, { data: matchData }] = useMutation(CREATE_MATCH);
  const [updateUser] = useMutation(UPDATE_USER);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [selectedFriend, setSelectedFriend] = useState(friend);
  const [selectedMode, setSelectedMode] = useState(null);
  const [categoryHash, setCategoryHash] = useState({});
  const [settingUp, setSettingUp] = useState(false);
  const [page, setPage] = useState(Page.MODE);

  const friends = data ? data.friends : [];
  const { categories, user } = data || {};

  const fuse = new Fuse(friends, fuzzyOptions);
  const results = fuse.search(search).map(({ item }) => item);

  useEffect(() => {
    fetchFriends();

    if (friend || mode) {
      const modeNumber = mode && mode === 'versus' ? 1 : 0;
      setSelectedMode(friend ? 1 : modeNumber);
      setPage(Page.CATEGORY);
    }
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
    if (matchData && matchData.match) navigateOnDone();
  }, [matchData]);

  const fetchFriends = async () => {
    const token = await AsyncStorage.getItem('CHRDS_TOKEN');
    const { _id } = jwtDecode(token);
    getData({ variables: { _id } });
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

  const back = () => {
    if (page === Page.FRIEND) setSelectedFriend(null);
    else if (page === Page.CATEGORY) setSelectedCategory(null);
    setPage(page - 1);
  };

  const getFinalCategory = actualCategory => {
    let finalCategory = actualCategory;
    if (selectedCategory === '-1') {
      const randomIndex = Math.floor(Math.random() * user.categories.length);
      finalCategory = user.categories[randomIndex];
      setSelectedCategory(finalCategory);
    }
    return finalCategory;
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

  const handleFFAPlay = async actualCategory => {
    const finalCategory = getFinalCategory(actualCategory);

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

  const handleVersusPlay = async (actualCategory, actualFriend) => {
    const finalCategory = getFinalCategory(actualCategory);
    let opponent = actualFriend;

    if (!user.isPro && user.lives <= 0) {
      openProModal();
      return;
    }

    if (selectedFriend === '-1') {
      opponent = await fetchRandomOpponent();
      setSelectedFriend(opponent);
    }

    if (!opponent) return;

    const payload = {
      userID: opponent,
      opponentUsername: user.displayName,
      type: 'create'
    };

    const variables = {
      players: [user._id, opponent],
      category: finalCategory,
      turn: user._id,
      score: JSON.stringify({ [user._id]: 0, [opponent]: 0 })
    };

    const lifeDate = user.lifeDate || dayjs().toString();
    const properties = JSON.stringify({ lives: user.lives - 1, lifeDate });

    analytics.logEvent('match_create_versus', {
      category: finalCategory,
      friend: opponent,
      isRandom: selectedFriend === '-1'
    });

    await updateUser({ variables: { id: user._id, properties } });
    await createMatch({ variables });

    await callApi('notify', payload, 'POST');
  };

  const handlePlay = async (args = {}) => {
    const { newMode, newCategory, newFriend } = args;
    const actualMode = newMode !== undefined ? newMode : selectedMode;
    const actualFriend = newFriend !== undefined ? newFriend : selectedFriend;
    const actualCategory =
      newCategory !== undefined ? newCategory : selectedCategory;

    if (settingUp) return;

    setSettingUp(true);

    try {
      if (actualMode === 0) handleFFAPlay(actualCategory);
      else handleVersusPlay(actualCategory, actualFriend);
    } catch (exception) {
      console.warn(exception.message);
      setSettingUp(false);
    }
  };

  const selectMode = newMode => () => {
    setSelectedMode(newMode);

    if (selectedCategory !== null && newMode === 0) handlePlay({ newMode });
    else if (selectedCategory !== null && newMode === 1) setPage(Page.FRIEND);
    else setPage(Page.CATEGORY);
  };

  const selectCategory = newCategory => () => {
    setSelectedCategory(newCategory);

    if (selectedFriend !== null || selectedMode === 0)
      handlePlay({ newCategory });
    else setPage(Page.FRIEND);
  };

  const selectFriend = newFriend => () => {
    setSelectedFriend(newFriend);
    handlePlay({ newFriend });
  };

  const handleOpenPurchase = dataCategory => () => {
    const openData = { category: dataCategory, user };
    openPurchase(openData);
  };

  const handleTextChange = text => setSearch(text);

  return (
    <PagePopup
      close={close}
      back={back}
      title="Create a Match"
      page={page}
      containerStyle={styles.container}
      avoidKeyboard={false}
    >
      <SelectMode selectMode={selectMode} />
      <SelectCategory
        categories={categories || []}
        selectCategory={selectCategory}
        categoryHash={categoryHash}
        isPro={user ? user.isPro : false}
        openPurchase={handleOpenPurchase}
        openShop={openShop}
      />
      {settingUp ? (
        <Setup />
      ) : (
        <SelectFriend
          friends={results.length > 0 ? results : friends}
          select={selectFriend}
          search={search}
          openAdd={openAdd}
          onChangeText={handleTextChange}
        />
      )}
    </PagePopup>
  );
};

const styles = StyleSheet.create({
  container: {
    height: (Layout.window.height * 7) / 8
  }
});

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
