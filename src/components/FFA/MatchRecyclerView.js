/* eslint-disable no-param-reassign, react/no-this-in-sfc */
import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { getDeviceId } from 'react-native-device-info';
import { RecyclerListView, LayoutProvider } from 'recyclerlistview';
import { bool, func, number, object } from 'prop-types';

import UPDATE_USER from '../../graphql/mutations/updateUser';
import CREATE_REPORT from '../../graphql/mutations/createReport';

import {
  toggleBadge,
  togglePurchasePopup,
  togglePro
} from '../../actions/popup';

import Row from './MatchRow';
import EmptyRow from './EmptyRow';
import OptionsModal from './OptionsModal';
import ReportPopup from './ReportPopup';
import Walkthrough from './WalkthroughOverlay';

import Layout from '../../constants/Layout';

const deviceID = getDeviceId();
const IS_IPHONE_X =
  deviceID.includes('iPhone12') || deviceID.includes('iPhone11');

const mapDispatchToProps = dispatch => ({
  openCoinShop: () => dispatch(togglePurchasePopup(true)),
  displayBadge: (message, type) => dispatch(toggleBadge(true, message, type)),
  openProModal: () => dispatch(togglePro(true))
});

const layoutProvider = new LayoutProvider(
  () => 0,
  (type, dim) => {
    dim.width = Layout.window.width;
    dim.height = Layout.window.height;
  }
);

const MatchRecyclerView = ({
  user,
  refetchUser,
  guessed,
  addToGuessed,
  guessing,
  setGuessing,
  activeIndex,
  onVisibleIndicesChanged,
  dataProvider,
  goBack,
  handleEmptyCreate,
  onBlockUser,
  openCoinShop,
  displayBadge,
  openProModal,
  initialRenderIndex,
  isSelf
}) => {
  const [updateUser] = useMutation(UPDATE_USER);
  const [createReport] = useMutation(CREATE_REPORT);
  const [optionsMatch, setOptionsMatch] = useState(null);
  const [reportMatch, setReportMatch] = useState(null);
  const [showWalkthrough, setShowWalkthrough] = useState(false);

  useEffect(() => {
    displayWalkthroughIfNeeded();
  }, []);

  const displayWalkthroughIfNeeded = async () => {
    const didDisplay = await AsyncStorage.getItem('displayedWalkthrough');
    if (didDisplay === 'true') return;

    setShowWalkthrough(true);
    await AsyncStorage.setItem('displayedWalkthrough', 'true');
  };

  const closeWalkthrough = () => setShowWalkthrough(false);

  const showOptions = match => () => setOptionsMatch(match);
  const hideOptions = () => setOptionsMatch(null);
  const showReport = match => () => {
    setReportMatch(match);
    hideOptions();
  };
  const hideReport = () => setReportMatch(null);

  const handleBlockUser = () => {
    const { sender } = optionsMatch;
    const index = user.blockedUsers
      ? user.blockedUsers.indexOf(sender._id)
      : -1;

    if (index !== -1) return;

    onBlockUser(sender);

    const properties = JSON.stringify({
      blockedUsers: [...user.blockedUsers, sender._id]
    });

    updateUser({ variables: { id: user._id, properties } });
    setOptionsMatch(null);
  };

  const handleReportSubmit = async (reason, message) => {
    try {
      await createReport({
        variables: {
          reason,
          message,
          sender: user._id,
          matchID: reportMatch._id
        }
      });
      hideReport();
      displayBadge(
        'Report sent, thank you for keeping the community safe!',
        'success'
      );
    } catch (exception) {
      displayBadge(exception.message.slice(14), 'error');
    }
  };

  const handleIndexChange = indeces => onVisibleIndicesChanged(indeces);

  const rowRenderer = (
    type,
    { _id, cloudFrontVideo, video, category, sender, actedWord, cameraType },
    index
  ) =>
    _id !== 'empty' ? (
      <Row
        _id={_id}
        uri={cloudFrontVideo || video}
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
        openProModal={openProModal}
        isSelf={isSelf}
      />
    ) : (
      <EmptyRow key={_id} createOwn={handleEmptyCreate} />
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
            initialRenderIndex={initialRenderIndex}
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
      {showWalkthrough ? <Walkthrough close={closeWalkthrough} /> : null}
      {optionsMatch ? (
        <OptionsModal
          close={hideOptions}
          showReport={showReport(optionsMatch)}
          blockUser={handleBlockUser}
        />
      ) : null}
      {reportMatch ? (
        <ReportPopup close={hideReport} submit={handleReportSubmit} />
      ) : null}
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

MatchRecyclerView.propTypes = {
  user: object.isRequired,
  refetchUser: func.isRequired,
  guessed: object,
  addToGuessed: func.isRequired,
  onVisibleIndicesChanged: func.isRequired,
  dataProvider: object,
  goBack: func.isRequired,
  handleEmptyCreate: func.isRequired,
  onBlockUser: func.isRequired,
  openCoinShop: func.isRequired,
  displayBadge: func.isRequired,
  openProModal: func.isRequired,
  guessing: bool.isRequired,
  setGuessing: func.isRequired,
  activeIndex: number.isRequired,
  initialRenderIndex: number,
  isSelf: bool
};

MatchRecyclerView.defaultProps = {
  guessed: {},
  dataProvider: null,
  initialRenderIndex: 0,
  isSelf: false
};

export default connect(
  null,
  mapDispatchToProps
)(MatchRecyclerView);
