import React, { useEffect, useState, useRef } from 'react';
import { AsyncStorage, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { connect } from 'react-redux';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import * as Brightness from 'expo-brightness';
import * as FileSystem from 'expo-file-system';
import { func, object } from 'prop-types';

import mime from '../helpers/mimeTypes';
import { useAnimation } from '../helpers/hooks';
import { upload } from '../actions/file';
import { toggleBadge } from '../actions/popup';

import GET_DATA from '../graphql/queries/getCameraData';
import GET_USER from '../graphql/queries/getCameraUser';
import UPDATE_MATCH from '../graphql/mutations/updateMatch';
import UPDATE_USER from '../graphql/mutations/updateUser';

import MainControls from '../components/Camera/MainControls';
import VideoOverlay from '../components/Camera/VideoOverlay';
import CountdownPopup from '../components/Camera/CountdownPopup';
import TopControls from '../components/Camera/TopControls';
import BottomControls from '../components/Camera/BottomControls';
import ReplayModal from '../components/Match/ReplayModal';
import PowerUps from '../components/Camera/PowerUps';
import PurchaseModal from '../components/Match/PurchaseModal';
import PickWordModal from '../components/Camera/PickWordModal';
import Hint from '../components/Match/HintModal';

const mapDispatchToProps = dispatch => ({
  uploadFile: file => dispatch(upload(file)),
  displayBadge: (message, type) => dispatch(toggleBadge(true, message, type))
});

const { front: frontType } = Camera.Constants.Type;
const { off: flashOff, on: flashOn, torch } = Camera.Constants.FlashMode;

let originalBrightness;

const CameraScreen = ({ navigation, uploadFile, displayBadge }) => {
  const categoryID = navigation.getParam('categoryID', '');
  const opponentID = navigation.getParam('opponentID', '');
  const matchID = navigation.getParam('matchID', '');
  const userID = navigation.getParam('userID', '');

  const { data } = useQuery(GET_DATA, {
    variables: { categoryID, opponentID, matchID }
  });
  const { data: userData, refetch } = useQuery(GET_USER, {
    variables: { userID }
  });
  const [hasPermissions, setPermissions] = useState(false);
  const [cameraType, setCameraType] = useState(frontType);
  const [flash, setFlash] = useState(flashOff);
  const [isRecording, setRecording] = useState(false);
  const [isCounting, setCounting] = useState(false);
  const [displayReplay, setDisplayReplay] = useState(false);
  const [videoUri, setVideoUri] = useState('');
  const [word, setWord] = useState('');
  const [powerup, setPowerup] = useState('');
  const [useAudio, setUseAudio] = useState(false);
  const [pickWord, setPickWord] = useState(false);
  const [rollCount, setRollCount] = useState(2);
  const [displayHint, setDisplayHint] = useState(false);
  const [updateMatch] = useMutation(UPDATE_MATCH);
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
    setBrightness(true);
    getRolls();
  }, []);

  useEffect(() => {
    if (isRecording) animateTo(1);
    else animateTo(0);

    setBrightness();
  }, [isRecording]);

  useEffect(() => {
    if (data && data.category) getCategoryWord();
    if (data && data.match) displayReplayIfNeeded();
  }, [data]);

  const getRandomWord = async () => {
    let randWord;

    do {
      const randomIndex = Math.floor(Math.random() * category.words.length);
      randWord = category.words[randomIndex];
    } while (randWord.text === word.text);

    AsyncStorage.setItem(`${matchID}-word`, JSON.stringify(randWord));
    await setWord(randWord);
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
    const rolls = await AsyncStorage.getItem(`${matchID}-rolls`);
    if (rolls) setRollCount(parseInt(rolls, 10));
  };

  const displayReplayIfNeeded = () => {
    if (match.replayWord) setDisplayReplay(true);
  };

  const closeReplay = () => {
    setDisplayReplay(false);
    removeReplayWord();
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

  const handleSend = async () => {
    const { size } = await FileSystem.getInfoAsync(videoUri, { size: true });
    const extension = videoUri.split('.').pop();
    const name = `${match._id}-round.${extension}`;

    const file = {
      uri: videoUri,
      name,
      size,
      type: mime(extension),
      matchID: match._id,
      opponentID: opponent._id,
      actedWord: word._id,
      cameraType
    };

    await AsyncStorage.removeItem(`${matchID}-word`);
    await AsyncStorage.removeItem(`${matchID}-rolls`);

    uploadFile(file);

    navigation.navigate('Home');
  };

  const handleReplay = async () => {
    await AsyncStorage.setItem(
      `${matchID}-word`,
      JSON.stringify(match.replayWord)
    );
    setWord(match.replayWord);
    removeReplayWord();
  };

  const handleRoll = async () => {
    if (rollCount <= 0) return;
    const newRollCount = rollCount - 1;

    await getRandomWord();
    setRollCount(newRollCount);
    await AsyncStorage.setItem(`${matchID}-rolls`, `${newRollCount}`);
  };

  const handleHand = () => setPickWord(true);
  const handleMic = () => setUseAudio(true);
  const showPurchase = selectedPowerup => () => setPowerup(selectedPowerup);
  const closePurchase = () => setPowerup('');

  const handlePickWord = async wordIndex => {
    const pickedWord = category.words[wordIndex];

    AsyncStorage.setItem(`${matchID}-word`, JSON.stringify(pickedWord));
    await setWord(pickedWord);

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

    refetch();
  };

  const removeReplayWord = () => {
    const properties = JSON.stringify({ replayWord: null });
    updateMatch({ variables: { matchID, properties } });
  };

  const waitForCountdown = () => setCounting(true);
  const closeVideo = () => setVideoUri(null);
  const openHint = () => setDisplayHint(true);
  const closeHint = () => setDisplayHint(false);

  const renderTopControls = () => (
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
          />
        </View>
      ) : (
        <Text>Doesnt have permissions screen</Text>
      )}
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
        />
      ) : null}
      {pickWord ? (
        <PickWordModal words={category.words} handleDone={handlePickWord} />
      ) : null}
      {isCounting ? <CountdownPopup onEnd={handleCountdownEnd} /> : null}
      {isRecording && cameraType === frontType && flash === flashOn ? (
        <View style={styles.frontFlash} />
      ) : null}
      {displayReplay ? (
        <ReplayModal
          question={`${opponent.username} couldn't guess ${match.replayWord} and asked you to replay it. Do you want to replay that word?`}
          close={closeReplay}
          handleReplay={handleReplay}
        />
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
  displayBadge: func.isRequired
};

export default connect(
  null,
  mapDispatchToProps
)(CameraScreen);
