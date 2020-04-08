/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { useQuery } from '@apollo/react-hooks';
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider
} from 'recyclerlistview';
import AsyncStorage from '@react-native-community/async-storage';
import JwtDecode from 'jwt-decode';
import { func, object } from 'prop-types';

import GET_DATA from '../graphql/queries/getProfileData';

import { addThumbnail } from '../actions/cache';
import { togglePlay } from '../actions/popup';
import Layout from '../constants/Layout';

import Header from '../components/Profile/Header';
import MatchRow from '../components/Profile/MatchRow';

const mapDispatchToProps = dispatch => ({
  addToCache: (_id, uri) => dispatch(addThumbnail(_id, uri)),
  openPlay: data => dispatch(togglePlay(true, data))
});

const mapStateToProps = ({ cache: { thumbnails } }) => ({
  thumbnailCache: thumbnails
});

const ViewTypes = {
  HEADER: 0,
  SELF_HEADER: 1,
  MATCH_ROW: 2
};

const provider = new DataProvider((a, b) => a[0]._id !== b[0]._id);

const ProfileScreen = ({
  navigation,
  thumbnailCache,
  addToCache,
  openPlay
}) => {
  const userID = navigation.getParam('userID', '');
  const { data } = useQuery(GET_DATA, { variables: { _id: userID } });
  const [dataProvider, setDataProvider] = useState(null);
  const [localUserID, setLocalUserID] = useState('');

  const user = data ? data.user : {};
  const matches = data ? data.matches : [];

  const layoutProvider = new LayoutProvider(
    index => {
      if (index === 0 && localUserID !== user._id) return ViewTypes.HEADER;
      if (index === 0 && localUserID === user._id) return ViewTypes.SELF_HEADER;

      return ViewTypes.MATCH_ROW;
    },
    (type, dim) => {
      switch (type) {
        case ViewTypes.HEADER:
          dim.width = Layout.window.width;
          dim.height = 358;
          break;
        case ViewTypes.SELF_HEADER:
          dim.width = Layout.window.width;
          dim.height = 298;
          break;
        case ViewTypes.MATCH_ROW:
          dim.width = Layout.window.width;
          dim.height = (Layout.window.width - 72) / 2 + 12;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    }
  );

  useEffect(() => {
    getLocalUserID();
  }, []);

  useEffect(() => {
    if (matches.length > 0 && !dataProvider) createData();
  }, [matches, dataProvider]);

  const createData = () => {
    const dividedMatches = [[{ _id: 'headerIndex' }]];
    const numberOfRows = Math.ceil(matches.length / 3);
    let sliceFrom = 0;

    for (let i = 0; i < numberOfRows; i += 1) {
      const sliceTo = sliceFrom + 3;
      dividedMatches.push(matches.slice(sliceFrom, sliceTo));
      sliceFrom = sliceTo;
    }

    setDataProvider(provider.cloneWithRows(dividedMatches));
  };

  const getLocalUserID = async () => {
    const { _id } = JwtDecode(await AsyncStorage.getItem('CHRDS_TOKEN'));
    setLocalUserID(_id);
  };

  const handleOpenPlay = () => openPlay({ playFriend: user._id });

  const goBack = () => navigation.goBack();

  const rowRenderer = (type, rowMatches) =>
    type === ViewTypes.HEADER || type === ViewTypes.SELF_HEADER ? (
      <Header
        goBack={goBack}
        user={user}
        gameCount={matches.length}
        isSelf={user._id === localUserID}
        onChallenge={handleOpenPlay}
      />
    ) : (
      <MatchRow
        matches={rowMatches}
        thumbnailCache={thumbnailCache}
        addToCache={addToCache}
      />
    );

  return (
    <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'never' }}>
      <View style={styles.container}>
        {dataProvider !== null ? (
          <RecyclerListView
            layoutProvider={layoutProvider}
            dataProvider={dataProvider}
            rowRenderer={rowRenderer}
            scrollViewProps={{
              showsVerticalScrollIndicator: false
            }}
          />
        ) : (
          <>
            <Header
              goBack={goBack}
              user={user}
              gameCount={matches.length}
              isSelf={user._id === localUserID}
              onChallenge={handleOpenPlay}
            />
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No Games</Text>
              <Text style={styles.emptyText}>
                This user has no Free for All games.
              </Text>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FCFCFE',
    minHeight: Layout.window.height - 52,
    overflow: 'hidden',
    paddingTop: 0,
    paddingBottom: 24
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24
  },
  emptyTitle: {
    fontFamily: 'sf-bold',
    fontSize: 24,
    opacity: 0.6,
    marginBottom: 12
  },
  emptyText: {
    fontFamily: 'sf-light',
    fontSize: 16,
    opacity: 0.4
  }
});

ProfileScreen.propTypes = {
  navigation: object.isRequired,
  thumbnailCache: object.isRequired,
  addToCache: func.isRequired,
  openPlay: func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileScreen);
