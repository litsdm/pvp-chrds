import React, { useEffect, useState, useRef } from 'react';
import { StatusBar, StyleSheet, Text, View, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { connect } from 'react-redux';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import * as Brightness from 'expo-brightness';
import { getInfoAsync, deleteAsync } from 'expo-file-system';
import { func, object } from 'prop-types';

import callApi from '../helpers/apiCaller';
import mime from '../helpers/mimeTypes';
import { analytics } from '../helpers/firebaseClients';
import { useAnimation } from '../helpers/hooks';
import { upload, uploadFFA } from '../actions/file';
import {
  toggleBadge,
  togglePurchasePopup,
  toggleTerms
} from '../actions/popup';

import GET_DATA from '../graphql/queries/getCameraData';
import GET_FFA_DATA from '../graphql/queries/getFFACameraData';
import GET_USER from '../graphql/queries/getCameraUser';
import UPDATE_USER from '../graphql/mutations/updateUser';

import MainControls from '../components/Camera/MainControls';
import VideoOverlay from '../components/Camera/VideoOverlay';
import CountdownPopup from '../components/Camera/CountdownPopup';
import TopControls from '../components/Camera/TopControls';
import BottomControls from '../components/Camera/BottomControls';
import PowerUps from '../components/Camera/PowerUps';
import PurchaseModal from '../components/Match/PurchaseModal';
import PickWordModal from '../components/Camera/PickWordModal';
import Hint from '../components/Match/HintModal';
import Walkthrough from '../components/Camera/Walkthrough';
import FFATopControls from '../components/Camera/FFATopControls';

const mapDispatchToProps = dispatch => ({
  uploadFile: (file, finishCB) => dispatch(upload(file, finishCB)),
  uploadFFAFile: file => dispatch(uploadFFA(file)),
  displayBadge: (message, type) => dispatch(toggleBadge(true, message, type)),
  openCoinShop: () => dispatch(togglePurchasePopup(true)),
  openTerms: data => dispatch(toggleTerms(true, data))
});

const { front: frontType } = Camera.Constants.Type;
const { off: flashOff, on: flashOn, torch } = Camera.Constants.FlashMode;

let originalBrightness;

const CameraScreen = ({
  navigation,
  uploadFile,
  uploadFFAFile,
  displayBadge,
  openCoinShop,
  openTerms
}) => {
  const categoryID = navigation.getParam('categoryID', '');
  const opponentID = navigation.getParam('opponentID', '');
  const matchID = navigation.getParam('matchID', '');
  const userID = navigation.getParam('userID', '');
  const mode = navigation.getParam('mode', '');

  const { data } =
    mode === 'versus'
      ? useQuery(GET_DATA, {
          variables: { categoryID, opponentID, matchID }
        })
      : useQuery(GET_FFA_DATA, { variables: { categoryID } });

  const { data: userData, refetch } = useQuery(GET_USER, {
    variables: { userID }
  });
  const [hasPermissions, setPermissions] = useState(false);
  const [cameraType, setCameraType] = useState(frontType);
  const [flash, setFlash] = useState(flashOff);
  const [isRecording, setRecording] = useState(false);
  const [isCounting, setCounting] = useState(false);
  const [videoUri, setVideoUri] = useState('');
  const [word, setWord] = useState('');
  const [powerup, setPowerup] = useState('');
  const [useAudio, setUseAudio] = useState(false);
  const [pickWord, setPickWord] = useState(false);
  const [rollCount, setRollCount] = useState(2);
  const [rolledWords, setRolledWords] = useState([]);
  const [displayHint, setDisplayHint] = useState(false);
  const [displayWalkthrough, setDisplayWalkthrough] = useState(false);
  const [updateUser] = useMutation(UPDATE_USER);
  const { animationValue, animateTo } = useAnimation({ duration: 200 });

  const category = data ? data.category : {};
  const opponent = data ? data.opponent : {};
  const match = data ? data.match : {};
  const user = userData ? userData.user : {};

  const camera = useRef(null);
  const cameraAnimation = useRef(null);
  const flashAnimation = useRef(null);

  useEffect(() => {
    checkPermissions();
    checkActivePowerUps();
    setBrightness(true);
    getRolls();
    shouldDisplayWalkthrough();
    analytics.setCurrentScreen('Camera');
  }, []);

  useEffect(() => {
    if (isRecording) animateTo(1);
    else animateTo(0);

    setBrightness();
  }, [isRecording]);

  useEffect(() => {
    if (data && data.category) getCategoryWord();
  }, [data]);

  const getRandomWord = async () => {
    let randWord;

    do {
      const randomIndex = Math.floor(Math.random() * category.words.length);
      randWord = category.words[randomIndex];
    } while (randWord.text === word.text);

    if (mode === 'versus')
      AsyncStorage.setItem(`${matchID}-word`, JSON.stringify(randWord));
    setWord(randWord);
  };

  const getCategoryWord = async () => {
    const storedWord = await AsyncStorage.getItem(`${matchID}-word`);

    if (storedWord) {
      setWord(JSON.parse(storedWord));
      return;
    }

    getRandomWord();
  };

  const getRolls = async () => {
    const rolls = JSON.parse(await AsyncStorage.getItem(`${matchID}-rolls`));
    if (rolls && rolls.length > 0) {
      setRolledWords(rolls);
      setRollCount(rolls.length - 2);
    }
  };

  const checkActivePowerUps = async () => {
    const { mic } =
      JSON.parse(await AsyncStorage.getItem(`${matchID}-activePowerups`)) || {};

    if (mic) setUseAudio(mic);
  };

  const addActivePowerUp = async pwrup => {
    const activePowerups =
      JSON.parse(await AsyncStorage.getItem(`${matchID}-activePowerups`)) || {};
    activePowerups[pwrup] = true;
    if (mode === 'versus') {
      await AsyncStorage.setItem(
        `${matchID}-activePowerups`,
        JSON.stringify(activePowerups)
      );
    }
  };

  const shouldDisplayWalkthrough = async () => {
    const walkthroughCount = parseInt(
      await AsyncStorage.getItem('walkthroughCount'),
      10
    );
    if (walkthroughCount === 2) return;
    setDisplayWalkthrough(true);
  };

  const closeWalkthrough = async () => {
    const walkthroughCount = parseInt(
      await AsyncStorage.getItem('walkthroughCount'),
      10
    );
    setDisplayWalkthrough(false);
    await AsyncStorage.setItem(
      'walkthroughCount',
      walkthroughCount ? `${walkthroughCount + 1}` : '1'
    );
  };

  const setState = newState =>
    Object.keys(newState).forEach(property => {
      const value = newState[property];
      switch (property) {
        case 'flash':
          if (value !== flashOff && flashAnimation.current)
            flashAnimation.current.play(60, 116);
          else if (value === flashOff && flashAnimation.current)
            flashAnimation.current.play(150, 204);
          return setFlash(value);
        case 'cameraType':
          if (value !== frontType && cameraAnimation.current)
            cameraAnimation.current.play(60, 72);
          else if (value === frontType && cameraAnimation.current)
            cameraAnimation.current.play(134, 150);
          return setCameraType(value);
        case 'isRecording':
          return setRecording(value);
        case 'videoUri':
          return setVideoUri(value);
        case 'isCounting':
          return setCounting(value);
        default:
          break;
      }
    });

  const setBrightness = async (original = false) => {
    const currentBrightness = await Brightness.getSystemBrightnessAsync();
    if (original) {
      originalBrightness = currentBrightness;
      return;
    }

    if (isRecording && cameraType === frontType && flash === flashOn)
      await Brightness.setSystemBrightnessAsync(1);
    else if (!isRecording && currentBrightness === 1) {
      await Brightness.setSystemBrightnessAsync(originalBrightness);
    }
  };

  const handleCountdownEnd = () => {
    setState({ isRecording: true, isCounting: false });
    recordVideo();
  };

  const goBack = () => navigation.navigate('Home');

  const checkPermissions = async () => {
    const { CAMERA, AUDIO_RECORDING, SYSTEM_BRIGHTNESS } = Permissions;
    const { status } = await Permissions.askAsync(
      CAMERA,
      AUDIO_RECORDING,
      SYSTEM_BRIGHTNESS
    );

    if (status !== 'granted') navigation.goBack();
    else setPermissions(true);
  };

  const stopRecording = () => {
    if (camera.current === null) return;

    camera.current.stopRecording();
    setRecording(false);
  };

  const recordVideo = async () => {
    if (camera.current === null) return;
    setRecording(true);
    const { uri } = await camera.current.recordAsync({
      quality: Camera.Constants.VideoQuality['480p'],
      maxDuration: 6,
      mute: !useAudio
    });
    setState({ isRecording: false, videoUri: uri });
  };

  const onAccept = () => refetch();

  const handleSend = async () => {
    if (!user.acceptedEula) {
      openTerms({ userID, onAccept });
      return;
    }

    if (mode === 'versus') handleVersusSend();
    else handleFFASend();

    analytics.logEvent('word_skips', {
      count: rolledWords.length,
      skippedWords: rolledWords
    });
  };

  const handleUploadFinish = notificationPayload => () => {
    callApi('notify', notificationPayload, 'POST');
  };

  const handleVersusSend = async () => {
    const { size } = await getInfoAsync(videoUri, { size: true });
    const extension = videoUri.split('.').pop();
    const name = `${match._id}-round.${extension}`;

    const iosCameraType = cameraType === frontType ? 1 : 2;

    const file = {
      uri: videoUri,
      name,
      size,
      type: mime(extension),
      matchID: match._id,
      opponentID: opponent._id,
      actedWord: word._id,
      cameraType: Platform.OS === 'ios' ? iosCameraType : cameraType
    };

    const notificationPayload = {
      userID: opponent._id,
      opponentUsername: user.displayName,
      type: 'turn'
    };

    await AsyncStorage.removeItem(`${matchID}-word`);
    await AsyncStorage.removeItem(`${matchID}-rolls`);
    await AsyncStorage.removeItem(`${matchID}-activePowerups`);

    uploadFile(file, handleUploadFinish(notificationPayload));

    navigation.navigate('Home');
  };

  const handleFFASend = async () => {
    const { size } = await getInfoAsync(videoUri, { size: true });
    const extension = videoUri.split('.').pop();
    const digits = Math.floor(1000 + Math.random() * 9000);
    const name = `${user._id}-ffa-${digits}.${extension}`;

    const iosCameraType = cameraType === frontType ? 1 : 2;

    const file = {
      uri: videoUri,
      name,
      size,
      type: mime(extension),
      actedWord: word._id,
      sender: user._id,
      cameraType: Platform.OS === 'ios' ? iosCameraType : cameraType,
      category: categoryID
    };

    uploadFFAFile(file);

    analytics.logEvent('match_create_ffa', {
      category: categoryID,
      word: word.text
    });

    navigation.navigate('Home', { displayFFANotification: true });
  };

  const handleRoll = async () => {
    if (rollCount <= 0) return;
    const newRollCount = rollCount - 1;
    const newRolledWords = [...rolledWords, word.text];

    setRolledWords(newRolledWords);
    await getRandomWord();
    setRollCount(newRollCount);
    if (mode === 'versus')
      await AsyncStorage.setItem(
        `${matchID}-rolls`,
        JSON.stringify(newRolledWords)
      );
  };

  const handleHand = () => setPickWord(true);
  const handleMic = async () => {
    setUseAudio(true);
    addActivePowerUp('mic');
  };
  const showPurchase = selectedPowerup => () => setPowerup(selectedPowerup);
  const closePurchase = () => setPowerup('');

  const handlePickWord = async wordIndex => {
    const pickedWord = category.words[wordIndex];

    if (mode === 'versus')
      AsyncStorage.setItem(`${matchID}-word`, JSON.stringify(pickedWord));
    setWord(pickedWord);

    setPickWord(false);
  };

  const handlePurchase = cost => async () => {
    if (powerup === 'mic' && useAudio) {
      displayBadge('Audio is already activated.', 'error');
      return;
    }

    const properties = JSON.stringify({ coins: user.coins - cost });

    switch (powerup) {
      case 'mic':
        handleMic();
        displayBadge('Audio recording activated!', 'success');
        break;
      case 'hand':
        handleHand();
        break;
      default:
        break;
    }

    closePurchase();

    await updateUser({ variables: { id: userID, properties } });

    analytics.logSpendVirtualCurrency({
      item_name: `${powerup}_powerup`,
      value: cost,
      virtual_currency_name: 'coins'
    });

    refetch();
  };

  const closeVideo = () => {
    deleteAsync(videoUri, { idempotent: true });
    setVideoUri(null);
  };

  const waitForCountdown = () => setCounting(true);
  const openHint = () => setDisplayHint(true);
  const closeHint = () => setDisplayHint(false);

  const renderTopControls = () =>
    mode === 'versus' ? (
      <TopControls
        goBack={videoUri ? closeVideo : goBack}
        iconName={videoUri ? 'md-close' : 'ios-arrow-round-back'}
        uri={opponent.profilePic}
        username={opponent.displayName}
        userScore={match.score ? JSON.parse(match.score)[userID] : 0}
        opponentScore={match.score ? JSON.parse(match.score)[opponent._id] : 0}
        isRecording={isRecording}
        category={category}
      />
    ) : (
      <FFATopControls
        goBack={videoUri ? closeVideo : goBack}
        iconName={videoUri ? 'md-close' : 'ios-arrow-round-back'}
      />
    );

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      {hasPermissions ? (
        <View style={styles.cameraWrapper}>
          <Camera
            style={{ flex: 1 }}
            type={cameraType}
            flashMode={isRecording && flash === flashOn ? torch : flashOff}
            ratio="16:9"
            ref={camera}
          />
          {!isRecording ? (
            <>
              {renderTopControls()}
              <PowerUps onPress={showPurchase} />
            </>
          ) : null}
          <MainControls
            flash={flash}
            cameraType={cameraType}
            recordVideo={waitForCountdown}
            setState={setState}
            isRecording={isRecording}
            cameraAnimationRef={cameraAnimation}
            flashAnimationRef={flashAnimation}
            animationValue={animationValue}
            word={word.text}
            stopRecording={stopRecording}
            rollCount={rollCount}
            roll={handleRoll}
            categoryColor={category.color}
            openPurchase={showPurchase}
            openHint={openHint}
            allowMic={word.allowMic || useAudio}
          />
        </View>
      ) : (
        <Text>Doesnt have permissions screen</Text>
      )}
      {displayWalkthrough ? (
        <Walkthrough
          close={closeWalkthrough}
          word={word.text}
          category={category}
          opponent={opponent}
        />
      ) : null}
      {videoUri ? (
        <VideoOverlay
          uri={videoUri}
          setState={setState}
          cameraType={cameraType}
        >
          {renderTopControls()}
          <BottomControls send={handleSend} />
        </VideoOverlay>
      ) : null}
      {powerup ? (
        <PurchaseModal
          powerup={powerup}
          close={closePurchase}
          coins={user.coins}
          handlePurchase={handlePurchase}
          openCoinShop={openCoinShop}
        />
      ) : null}
      {pickWord ? (
        <PickWordModal words={category.words} handleDone={handlePickWord} />
      ) : null}
      {isCounting ? <CountdownPopup onEnd={handleCountdownEnd} /> : null}
      {isRecording && cameraType === frontType && flash === flashOn ? (
        <View style={styles.frontFlash} />
      ) : null}
      {displayHint ? (
        <Hint hint={word.actorHint || word.hint} close={closeHint} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1
  },
  frontFlash: {
    backgroundColor: '#fff',
    bottom: 0,
    left: 0,
    opacity: 0.9,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 10
  },
  cameraWrapper: {
    flex: 1
  }
});

CameraScreen.propTypes = {
  navigation: object.isRequired,
  uploadFile: func.isRequired,
  uploadFFAFile: func.isRequired,
  displayBadge: func.isRequired,
  openCoinShop: func.isRequired,
  openTerms: func.isRequired
};

export default connect(null, mapDispatchToProps)(CameraScreen);
