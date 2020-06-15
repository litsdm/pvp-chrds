/* eslint-disable no-param-reassign, react/no-this-in-sfc */
import React, { useEffect, useState } from 'react';
import { AppState, BackHandler } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { DataProvider } from 'recyclerlistview';
import { object } from 'prop-types';

import GET_DATA from '../graphql/queries/getFFAData';
import GET_USER_DATA from '../graphql/queries/getFFAUserData';

import callApi from '../helpers/apiCaller';
import { analytics } from '../helpers/firebaseClients';

import MatchRecyclerView from '../components/FFA/MatchRecyclerView';

const ITEMS = 15;

const provider = new DataProvider((a, b) => a._id !== b._id);

let _guessing = false;
let _activeIndex = 0;
const _history = {};

const FFAScreen = ({ navigation }) => {
  const userID = navigation.getParam('userID', '');
  const { data, refetch } = useQuery(GET_DATA, {
    variables: { userID, skip: 0 }
  });
  const { data: userData, refetch: refetchUser } = useQuery(GET_USER_DATA, {
    variables: { userID }
  });
  const [guessed, setGuessed] = useState({});
  const [guessing, setGuessing] = useState(false);
  const [skip, setSkip] = useState(ITEMS);
  const [matches, setMatches] = useState([]);
  const [didRefetch, setDidRefetch] = useState(false);
  const [dataProvider, setDataProvider] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const user = userData ? userData.user : {};

  // Expose these variables to goBack & background event listeners, need to find a better way but for now this is the easiest I came up with.
  _guessing = guessing;
  _activeIndex = activeIndex;

  useEffect(() => {
    AppState.addEventListener('change', handleStateChange);
    BackHandler.addEventListener('hardwareBackPress', goBack);
    analytics.setCurrentScreen('FFA');
    return () => {
      AppState.removeEventListener('change', handleStateChange);
      BackHandler.removeEventListener('hardwareBackPress');
    };
  }, []);

  useEffect(() => {
    if (data && data.newMatches) {
      const matchesToSet = [...matches, ...data.newMatches];

      if (matches.length === 0) {
        setMatches(matchesToSet);
        setDataProvider(provider.cloneWithRows(matchesToSet));
        return;
      }

      const includesID = data.newMatches.some(
        ({ _id }) => _id === matches[matches.length - 1]._id
      );
      if (didRefetch && !includesID) {
        setMatches(matchesToSet);
        setDataProvider(provider.cloneWithRows(matchesToSet));
        setDidRefetch(false);
      }
    }
  }, [data, matches, didRefetch]);

  useEffect(() => {
    if (userData && userData.user) {
      const { ffaGuessed } = userData.user;
      setGuessed(JSON.parse(ffaGuessed || '{}'));
    }
  }, [userData]);

  useEffect(() => {
    if (!data) return;

    const { length } = matches;
    if (activeIndex === length - 2 && matches[length - 1]._id !== 'empty') {
      refetch({ userID, skip });
      setDidRefetch(true);
      setSkip(skip + ITEMS);
    }
  }, [activeIndex, matches]);

  const addToGuessed = _id => result =>
    setGuessed({ ...guessed, [_id]: result });

  const handleStateChange = async nextAppState => {
    if (nextAppState.match(/inactive|background/)) {
      updateHistory();
    }
  };

  const updateHistory = async () => {
    const history = JSON.stringify(_history);
    await callApi('updateHistory', { history }, 'POST');
  };

  const goBack = async () => {
    if (_guessing) setGuessing(false);
    else {
      updateHistory();
      navigation.navigate('Home', { userID });
      return true;
    }
    return false;
  };

  const handleBlockUser = sender => {
    const filtered = matches.filter(match => {
      if (!match.sender) return true;
      return match.sender._id !== sender._id;
    });

    setMatches(filtered);
    setDataProvider(provider.cloneWithRows(filtered));
  };

  const handleCreateOwn = () => {
    navigation.navigate('Home', { userID, playFromFFA: true });
  };

  const addToHistory = match => {
    if (match._id === 'empty') return;
    const parsedViewed = JSON.parse(match.viewedHash);

    if (parsedViewed[userID]) return;

    if (_history[match._id]) _history[match._id] = {};

    _history[match._id] = { ..._history[match._id], [userID]: true };
  };

  const handleIndexChange = async indeces => {
    let index;
    if (indeces.length === 1) {
      [index] = indeces;
    } else {
      index = _activeIndex === indeces[0] ? indeces[1] : indeces[0];
    }
    setActiveIndex(index);
    addToHistory(matches[index]);

    if (_guessing) setGuessing(false);
  };

  return (
    <MatchRecyclerView
      user={user}
      refetchUser={refetchUser}
      goBack={goBack}
      onVisibleIndicesChanged={handleIndexChange}
      handleEmptyCreate={handleCreateOwn}
      onBlockUser={handleBlockUser}
      guessed={guessed}
      addToGuessed={addToGuessed}
      guessing={guessing}
      activeIndex={activeIndex}
      setGuessing={setGuessing}
      dataProvider={dataProvider}
    />
  );
};

FFAScreen.propTypes = {
  navigation: object.isRequired
};

export default FFAScreen;
