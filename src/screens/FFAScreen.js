/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import {
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
import { func, object } from 'prop-types';

import GET_DATA from '../graphql/queries/getFFAData';
import GET_USER_DATA from '../graphql/queries/getFFAUserData';
import UPDATE_USER from '../graphql/mutations/updateUser';

import { toggleBadge, togglePurchaseModal } from '../actions/popup';

import Row from '../components/FFA/MatchRow';
import EmptyRow from '../components/FFA/EmptyRow';

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

const FFAScreen = ({ navigation, openCoinShop, displayBadge }) => {
  const userID = navigation.getParam('userID', '');
  const { data, refetch } = useQuery(GET_DATA, {
    variables: { userID, skip: 0 }
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

  const user = userData ? userData.user : {};

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', goBack);
    return () => BackHandler.removeEventListener('hardwareBackPress');
  }, []);

  useEffect(() => {
    if (data && data.matches) {
      if (matches.length === 0) {
        setMatches(data.matches);
        setDataProvider(provider.cloneWithRows(data.matches));
        return;
      }

      const includesID = data.matches.some(
        ({ _id }) => _id === matches[matches.length - 1]._id
      );
      if (didRefetch && !includesID) {
        const newMatches = [...matches, ...data.matches];
        setMatches(newMatches);
        setDataProvider(provider.cloneWithRows(newMatches));
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

  const goBack = async () => {
    if (guessing) setGuessing(false);
    else {
      navigation.navigate('Home', { userID });
      return true;
    }
    return false;
  };

  const handleIndexChange = indeces => {
    if (indeces.length === 1) setActiveIndex(indeces[0]);
  };

  const rowRenderer = (
    type,
    { _id, video, category, sender, actedWord },
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
        key={_id}
      />
    ) : (
      <EmptyRow key={_id} />
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
