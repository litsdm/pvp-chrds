import React, { useState, useRef, useEffect } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { bool, func, number, object, string, shape } from 'prop-types';

import { analytics } from '../../helpers/firebaseClients';

import Loader from '../Loader';
import RowControls from './RowControls';
import LetterSoup from '../Match/LetterSoup';
import PowerUps from './PowerUps';
import Hint from '../Match/HintModal';
import PurchaseModal from '../Match/PurchaseModal';

import Layout from '../../constants/Layout';
import { GuessedTypes } from '../../constants/Types';

const FFAMatchRow = ({
  _id,
  uri,
  active,
  username,
  categoryName,
  word,
  user,
  updateUser,
  refetchUser,
  openCoinShop,
  displayBadge,
  addToGuessed,
  guessing,
  setGuessing,
  guessed,
  cameraType,
  showOptions,
  openProModal,
  isSelf,
  openRetry,
  openShare,
  allowShare
}) => {
  const [buffering, setBuffering] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [resultStatus, setResultStatus] = useState(0);
  const [exploded, setExploded] = useState(false);
  const [fillActive, setFillActive] = useState(false);
  const [powerup, setPowerup] = useState('');
  const [displayHint, setDisplayHint] = useState(false);
  const video = useRef(null);

  useEffect(() => {
    if (!loaded) loadVideo();
    manageVideo();
  }, [active]);

  const loadVideo = async () => {
    await video.current.loadAsync(
      { uri, androidImplementation: 'MediaPlayer' },
      { isLooping: true, shouldPlay: active }
    );
  };

  const manageVideo = async () => {
    if (active) await video.current.playAsync();
    else await video.current.pauseAsync();
  };

  const handleBomb = () => setExploded(true);
  const handleFill = () => setFillActive(true);
  const showHint = () => setDisplayHint(true);
  const closeHint = () => setDisplayHint(false);
  const showPurchase = selectedPowerup => () => setPowerup(selectedPowerup);
  const closePurchase = () => setPowerup('');

  const handlePurchase = cost => async () => {
    const properties = JSON.stringify({ coins: user.coins - cost });

    switch (powerup) {
      case 'bomb':
        handleBomb();
        break;
      case 'hint':
        showHint();
        break;
      case 'fill':
        handleFill();
        break;
      default:
        break;
    }

    closePurchase();

    await updateUser({ variables: { id: user._id, properties } });

    analytics.logSpendVirtualCurrency({
      item_name: `${powerup}_powerup_ffa`,
      value: cost,
      virtual_currency_name: 'coins'
    });

    refetchUser();
  };

  const handleSuccess = async () => {
    const ffaGuessed = JSON.stringify({
      ...guessed,
      [_id]: GuessedTypes.SUCCESS
    });
    const properties = JSON.stringify({
      xp: user.xp + 1,
      ffaPoints: user.ffaPoints ? user.ffaPoints + 15 : 15,
      ffaGuessed
    });

    handleGuessFinish(GuessedTypes.SUCCESS);

    await updateUser({ variables: { id: user._id, properties } });
    refetchUser();

    displayBadge("Awesome! You've earned +15 FFA Points", 'success');
  };

  const handleFailure = async () => {
    const guessedResult =
      guessed[_id] === GuessedTypes.RETRY
        ? GuessedTypes.FAIL_RETRY
        : GuessedTypes.FAIL;
    const ffaGuessed = JSON.stringify({ ...guessed, [_id]: guessedResult });
    const properties = JSON.stringify({
      ffaPoints: user.ffaPoints ? user.ffaPoints - 5 : 0,
      lives: user.lives - 1,
      ffaGuessed
    });
    const message =
      guessedResult === GuessedTypes.FAIL
        ? 'Nice try, you can have one more try!'
        : `Nice try, the word was ${word.text}`;

    handleGuessFinish(GuessedTypes.FAIL);

    await updateUser({ variables: { id: user._id, properties } });
    refetchUser();

    displayBadge(message, 'default');
  };

  const handleGuessFinish = result => {
    setGuessing(false);
    addToGuessed(result);
    analytics.logEvent('guessed_ffa', { result });
  };

  const handleGuess = () => {
    if (!user.isPro && user.lives <= 0) {
      openProModal();
      return;
    }
    setGuessing(true);
  };

  const handlePlaybackUpdate = status => {
    if (status.isBuffering && !buffering) setBuffering(true);
    if (!status.isBuffering && buffering) setBuffering(false);
    if (status.isLoaded && !loaded) setLoaded(true);
    if (!status.isLoaded && loaded) setLoaded(false);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        style={styles.gradient}
        colors={['transparent', 'rgba(0, 0, 0, 0.4)']}
        pointerEvents="none"
      />
      {!loaded ? <Loader /> : null}
      <Video
        ref={video}
        onPlaybackStatusUpdate={handlePlaybackUpdate}
        resizeMode="cover"
        style={[
          styles.video,
          cameraType === 1 ? { transform: [{ scaleX: -1 }] } : {}
        ]}
      />
      {buffering && Platform.OS === 'ios' ? (
        <View style={styles.buffering}>
          <ActivityIndicator size="small" color="#fff" />
        </View>
      ) : null}
      {guessing ? (
        <>
          {displayHint ? <Hint hint={word.hint} close={closeHint} /> : null}
          {powerup ? (
            <PurchaseModal
              powerup={powerup}
              close={closePurchase}
              coins={user.coins}
              handlePurchase={handlePurchase}
              openCoinShop={openCoinShop}
            />
          ) : null}
          <LetterSoup
            word={word.text.toUpperCase()}
            resultStatus={resultStatus}
            setResultStatus={setResultStatus}
            onSuccess={handleSuccess}
            onFailure={handleFailure}
            exploded={exploded}
            fillActive={fillActive}
            setFillActive={setFillActive}
          />
          <PowerUps onPress={showPurchase} />
        </>
      ) : (
        <RowControls
          username={username}
          categoryName={categoryName}
          handleGuess={handleGuess}
          guessedResult={guessed[_id]}
          showOptions={showOptions}
          isSelf={isSelf}
          openRetry={openRetry(_id)}
          openShare={openShare}
          allowShare={allowShare}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Layout.window.height,
    width: Layout.window.width
  },
  video: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  },
  gradient: {
    bottom: 0,
    height: '50%',
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 1
  },
  loadingOverlay: {
    alignItems: 'center',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1
  },
  buffering: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    right: 24,
    top: 44,
    zIndex: 6
  }
});

FFAMatchRow.propTypes = {
  _id: string.isRequired,
  uri: string.isRequired,
  active: bool.isRequired,
  username: string.isRequired,
  categoryName: string.isRequired,
  refetchUser: func.isRequired,
  updateUser: func.isRequired,
  openCoinShop: func.isRequired,
  displayBadge: func.isRequired,
  guessed: object.isRequired,
  addToGuessed: func.isRequired,
  guessing: bool.isRequired,
  setGuessing: func.isRequired,
  cameraType: number.isRequired,
  showOptions: func.isRequired,
  openProModal: func.isRequired,
  isSelf: bool.isRequired,
  openRetry: func.isRequired,
  openShare: func.isRequired,
  allowShare: number.isRequired,
  word: shape({
    _id: string,
    text: string,
    hint: string
  }).isRequired,
  user: shape({
    _id: string,
    cost: number,
    ffaPoints: number
  }).isRequired
};

export default FFAMatchRow;
