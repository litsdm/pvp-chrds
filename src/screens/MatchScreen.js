import React, { useState, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { Camera } from 'expo-camera';
import { object } from 'prop-types';

import GET_DATA from '../graphql/queries/getMatchData';

import { getSignedUrl } from '../helpers/apiCaller';

import TopControls from '../components/Camera/TopControls';
import LetterSoup from '../components/LetterSoup';

const { front } = Camera.Constants.Type;
const PRE_ICON = Platform.OS === 'ios' ? 'ios' : 'md';

const MatchScreen = ({ navigation }) => {
  const categoryID = navigation.getParam('categoryID', '');
  const opponentID = navigation.getParam('opponentID', '');
  const matchID = navigation.getParam('matchID', '');
  const userID = navigation.getParam('userID', '');
  const { data } = useQuery(GET_DATA, {
    variables: { categoryID, opponentID, matchID }
  });
  const [gameState, setGameState] = useState('awaitUser');
  const [playCount, setPlayCount] = useState(0);
  const [uriFlag, setUriFlag] = useState(false);
  const [buffering, setBuffering] = useState(true);
  const videoRef = useRef(null);

  const category = data ? data.category : {};
  const opponent = data ? data.opponent : {};
  const match = data ? data.match : {};

  useEffect(() => {
    if (match.video && videoRef && !uriFlag) fetchSignedUri();
  }, [match, videoRef]);

  const fetchSignedUri = async () => {
    const filename = match.video.split('/').pop();
    const uri = await getSignedUrl(filename, 'Videos');
    await videoRef.current.loadAsync(
      { uri, androidImplementation: 'MediaPlayer' },
      {},
      true
    );
    setUriFlag(true);
  };

  const playVideo = async () => {
    const newCount = playCount + 1;
    setGameState('playVideo');
    setPlayCount(newCount);
    AsyncStorage.setItem(`${matchID}-playcount`, `${newCount}`);
    if (newCount === 1) await videoRef.current.playAsync();
    else if (newCount >= 2) await videoRef.current.replayAsync();
  };

  const switchToGuess = async () => {
    await videoRef.current.stopAsync();
    setGameState('guessing');
  };

  const handlePlaybackUpdate = status => {
    if (status.isBuffering && !buffering) setBuffering(true);
    if (!status.isBuffering && buffering) setBuffering(false);
    if (status.didJustFinish && playCount === 1) setGameState('awaitUser');
    if (status.didJustFinish && playCount === 2) setGameState('guessing');
  };

  const goBack = () => navigation.navigate('Home');

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'light-content' : 'dark-content'}
      />
      <View style={styles.videoWrapper}>
        <Video
          ref={videoRef}
          resizeMode="cover"
          onPlaybackStatusUpdate={handlePlaybackUpdate}
          style={[
            styles.video,
            match.cameraType === front ? { transform: [{ scaleX: -1 }] } : {}
          ]}
        />
        {buffering ? (
          <View style={styles.videoLoader}>
            <ActivityIndicator size="small" color="#fefefe" />
            <Text style={styles.loadingText}>Loading video...</Text>
          </View>
        ) : null}
        {gameState === 'awaitUser' ? (
          <View style={styles.overlay}>
            <Text style={styles.infoText}>
              You can only play the video twice, you&#39;ll have 30 seconds to
              guess the word after the video ends.
            </Text>
            <TouchableOpacity style={styles.button} onPress={playVideo}>
              <Text style={styles.buttonText}>
                {playCount < 1 ? 'Play' : 'Replay'} Video
              </Text>
              <Ionicons
                name={`${PRE_ICON}-${playCount < 1 ? 'play' : 'repeat'}`}
                color="#7c4dff"
                size={18}
              />
            </TouchableOpacity>
          </View>
        ) : null}
        {playCount > 0 && gameState !== 'guessing' ? (
          <TouchableOpacity style={styles.guessButton} onPress={switchToGuess}>
            <Text style={styles.buttonText}>Guess Word</Text>
            <Ionicons name="ios-arrow-forward" color="#7c4dff" size={18} />
          </TouchableOpacity>
        ) : null}
        <TopControls
          goBack={goBack}
          iconName="ios-arrow-round-back"
          uri={opponent.profilePic}
          username={opponent.username}
          userScore={match.score ? JSON.parse(match.score)[userID] : 0}
          opponentScore={
            match.score ? JSON.parse(match.score)[opponent._id] : 0
          }
        />
        {gameState === 'guessing' ? (
          <LetterSoup word={match.actedWord.toUpperCase()} />
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  videoWrapper: {
    flex: 1
  },
  video: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1
  },
  infoText: {
    color: '#fff',
    marginBottom: 12,
    opacity: 0.5,
    textAlign: 'center',
    width: '70%'
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 6
  },
  buttonText: {
    color: '#7c4dff',
    fontFamily: 'sf-bold',
    fontSize: 18,
    marginRight: 12
  },
  guessButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    bottom: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    position: 'absolute',
    right: 24
  },
  videoLoader: {
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    right: 12,
    top: 72
  },
  loadingText: {
    color: '#fff',
    fontFamily: 'sf-regular',
    marginLeft: 6
  }
});

MatchScreen.propTypes = {
  navigation: object.isRequired
};

export default MatchScreen;
