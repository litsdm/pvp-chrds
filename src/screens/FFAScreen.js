/* eslint-disable no-param-reassign, react/no-this-in-sfc */
import React, { useEffect, useState } from 'react';
import {
  AppState,
  BackHandler,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { getDeviceId } from 'react-native-device-info';
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider
} from 'recyclerlistview';
import dayjs from 'dayjs';
import { func, object } from 'prop-types';

import GET_DATA from '../graphql/queries/getFFAData';
import GET_USER_DATA from '../graphql/queries/getFFAUserData';
import UPDATE_USER from '../graphql/mutations/updateUser';

import { toggleBadge, togglePurchaseModal } from '../actions/popup';

import Row from '../components/FFA/MatchRow';
import EmptyRow from '../components/FFA/EmptyRow';
import OptionsModal from '../components/FFA/OptionsModal';

import Layout from '../constants/Layout';

const ITEMS = 30;

const deviceID = getDeviceId();
const IS_IPHONE_X =
  deviceID.includes('iPhone12') || deviceID.includes('iPhone11');

const mapDispatchToProps = dispatch => ({
  openCoinShop: () => dispatch(togglePurchaseModal(true)),
  displayBadge: (message, type) => dispatch(toggleBadge(true, message, type))
});

const provider = new DataProvider((a, b) => a._id !== b._id);

const layoutProvider = new LayoutProvider(
  () => 0,
  (type, dim) => {
    dim.width = Layout.window.width;
    dim.height = Layout.window.height;
  }
);

let _initialDate = null;
let _lastDate = null;
let _guessing = false;

const FFAScreen = ({ navigation, openCoinShop, displayBadge }) => {
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
  const [optionsMatch, setOptionsMatch] = useState(null);

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
      await updateDatePointers();
    }
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
      navigation.navigate('Home', { userID });
      return true;
    }
    return false;
  };

  const showOptions = match => () => setOptionsMatch(match);
  const hideOptions = () => setOptionsMatch(null);

  const handleCreateOwn = () => {
    navigation.navigate('Home', { userID, playFromFFA: true });
  };

  const handleIndexChange = indeces => {
    if (indeces.length === 1) {
      const index = indeces[0];
      setActiveIndex(index);
      if (
        matches[index]._id !== 'empty' &&
        dayjs(matches[index].createdOn).isBefore(dayjs(lastDate))
      ) {
        setLastDate(matches[index].createdOn);
      }
    }
  };

  const rowRenderer = (
    type,
    { _id, video, category, sender, actedWord, cameraType },
    index
  ) =>
    _id !== 'empty' ? (
      <Row
        _id={_id}
        uri={video}
        active={index === activeIndex}
        username={sender.displayName}
        categoryName={category.name}
        word={actedWord}
        openCoinShop={openCoinShop}
        refetchUser={refetchUser}
        user={user}
        updateUser={updateUser}
        guessed={guessed}
        addToGuessed={addToGuessed(_id)}
        guessing={guessing}
        setGuessing={setGuessing}
        displayBadge={displayBadge}
        cameraType={cameraType}
        showOptions={showOptions({ _id, sender })}
        key={_id}
      />
    ) : (
      <EmptyRow key={_id} createOwn={handleCreateOwn} />
    );

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
        {dataProvider !== null ? (
          <RecyclerListView
            layoutProvider={layoutProvider}
            dataProvider={dataProvider}
            rowRenderer={rowRenderer}
            onVisibleIndicesChanged={handleIndexChange}
            extendedState={{ activeIndex }}
            scrollViewProps={{
              bounces: false,
              disableIntervalMomentum: true,
              pagingEnabled: true,
              decelerationRate: 'fast',
              snapToAlignment: 'start',
              showsVerticalScrollIndicator: false,
              directionalLockEnabled: true
            }}
          />
        ) : null}
      </View>
      {optionsMatch ? <OptionsModal close={hideOptions} /> : null}
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
  },
  back: {
    height: 30,
    width: 30
  }
});

FFAScreen.propTypes = {
  navigation: object.isRequired,
  openCoinShop: func.isRequired,
  displayBadge: func.isRequired
};

export default connect(
  null,
  mapDispatchToProps
)(FFAScreen);
