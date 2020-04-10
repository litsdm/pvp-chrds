/* eslint-disable no-param-reassign, react/no-this-in-sfc */
import React, { useEffect, useState } from 'react';
import { AppState, BackHandler } from 'react-native';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { DataProvider } from 'recyclerlistview';
import dayjs from 'dayjs';
import { object } from 'prop-types';

import GET_DATA from '../graphql/queries/getFFAData';
import GET_USER_DATA from '../graphql/queries/getFFAUserData';
import UPDATE_USER from '../graphql/mutations/updateUser';

import callApi from '../helpers/apiCaller';

import MatchRecyclerView from '../components/FFA/MatchRecyclerView';

const ITEMS = 30;

const provider = new DataProvider((a, b) => a._id !== b._id);

let _initialDate = null;
let _lastDate = null;
let _guessing = false;
const _history = {};

const FFAScreen = ({ navigation }) => {
  const userID = navigation.getParam('userID', '');
  const { data, refetch } = useQuery(GET_DATA, {
    variables: { userID, skip: 0, stopFilter: false }
  });
  const { data: userData, refetch: refetchUser } = useQuery(GET_USER_DATA, {
    variables: { userID }
  });
  const [updateUser] = useMutation(UPDATE_USER);
  const [guessed, setGuessed] = useState({});
  const [guessing, setGuessing] = useState(false);
  const [skip, setSkip] = useState(ITEMS);
  const [matches, setMatches] = useState([]);
  const [didRefetch, setDidRefetch] = useState(false);
  const [dataProvider, setDataProvider] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [seenMatches, setSeenMatches] = useState([]);
  const [stopFilter, setStopFilter] = useState(false);
  const [initialDate, setInitialDate] = useState(null);
  const [lastDate, setLastDate] = useState(null);

  const user = userData ? userData.user : {};

  // Expose these variables to goBack & background event listeners, need to find a better way but for now this is the easiest I came up with.
  _initialDate = initialDate;
  _lastDate = lastDate;
  _guessing = guessing;

  useEffect(() => {
    AppState.addEventListener('change', handleStateChange);
    BackHandler.addEventListener('hardwareBackPress', goBack);
    return () => {
      AppState.removeEventListener('change', handleStateChange);
      BackHandler.removeEventListener('hardwareBackPress');
    };
  }, []);

  useEffect(() => {
    if (data && data.FFAData) {
      const { newMatches } = data.FFAData;
      if (matches.length === 0) {
        const matchesToSet =
          data.FFAData.stopFilter || newMatches.length === 0
            ? [...newMatches, ...data.FFAData.seenMatches]
            : newMatches;

        if (data.FFAData.stopFilter && !stopFilter) setStopFilter(true);
        else if (!stopFilter) setSeenMatches(data.FFAData.seenMatches);
        setMatches(matchesToSet);
        setDataProvider(provider.cloneWithRows(matchesToSet));
        if (!initialDate) {
          setInitialDate(matchesToSet[0].createdOn);
          setLastDate(matchesToSet[0].createdOn);
        }
        return;
      }

      if (skip !== data.FFAData.skip) setSkip(data.FFAData.skip);

      const includesID = data.FFAData.newMatches.some(
        ({ _id }) => _id === matches[matches.length - 1]._id
      );
      if (didRefetch && !includesID) {
        const matchesToSet = data.FFAData.stopFilter
          ? [
              ...matches,
              ...newMatches,
              ...seenMatches,
              ...data.FFAData.seenMatches
            ]
          : [...matches, ...newMatches];

        if (data.FFAData.stopFilter && !stopFilter) {
          setSeenMatches([]);
          setStopFilter(true);
        }

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
      refetch({ userID, skip, stopFilter });
      setDidRefetch(true);
      setSkip(skip + ITEMS);
    }
  }, [activeIndex, matches]);

  const addToGuessed = _id => result =>
    setGuessed({ ...guessed, [_id]: result });

  const handleStateChange = async nextAppState => {
    if (nextAppState.match(/inactive|background/)) {
      updateHistory();
      await updateDatePointers();
    }
  };

  const updateHistory = async () => {
    const history = JSON.stringify(_history);
    await callApi('updateHistory', { history }, 'POST');
  };

  const updateDatePointers = async () => {
    const properties = JSON.stringify({
      initialDate: _initialDate,
      lastDate: _lastDate
    });
    await updateUser({ variables: { id: userID, properties } });
  };

  const goBack = async () => {
    if (_guessing) setGuessing(false);
    else {
      updateDatePointers();
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

  const handleIndexChange = indeces => {
    if (indeces.length === 1) {
      const index = indeces[0];
      setActiveIndex(index);
      addToHistory(matches[index]);

      if (_guessing) setGuessing(false);

      if (
        matches[index]._id !== 'empty' &&
        dayjs(matches[index].createdOn).isBefore(dayjs(lastDate))
      ) {
        setLastDate(matches[index].createdOn);
      }
    }
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
