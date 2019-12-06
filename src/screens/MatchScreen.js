import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { Camera } from 'expo-camera';

import GET_DATA from '../graphql/queries/getMatchData';

const { front } = Camera.Constants.Type;
const PRE_ICON = Platform.OS === 'ios' ? 'ios' : 'md';

const MatchScreen = ({ navigation }) => {
  const categoryID = navigation.getParam('categoryID', '');
  const opponentID = navigation.getParam('opponentID', '');
  const matchID = navigation.getParam('matchID', '');
  const { data, loading } = useQuery(GET_DATA, {
    variables: { categoryID, opponentID, matchID }
  });
  const [gameState, setGameState] = useState('awaitUser');
  const [playCount, setPlayCount] = useState(0);

  const category = data ? data.category : {};
  const opponent = data ? data.opponent : {};
  const match = data ? data.match : {};

  const playVideo = () => setGameState('playVideo');

  const handlePlaybackUpdate = status => console.log(status);

  return (
    <View style={styles.container}>
      <View style={styles.videoWrapper}>
        <Video
          source={{ uri: match.video, androidImplementation: 'MediaPlayer' }}
          shouldPlay={gameState === 'playVideo'}
          resizeMode="cover"
          onPlaybackStatusUpdate={handlePlaybackUpdate}
          style={[
            styles.video,
            match.cameraType === front ? { transform: [{ scaleX: -1 }] } : {}
          ]}
        />
        {gameState === 'awaitUser' ? (
          <View style={styles.overlay}>
            <Text style={styles.infoText}>
              You can only play the video twice, you&#39;ll have 30 seconds to
              guess the word after the video ends.
            </Text>
            <TouchableOpacity style={styles.button} onPress={playVideo}>
              <Text style={styles.buttonText}>Play Video</Text>
              <Ionicons name={`${PRE_ICON}-play`} color="#7c4dff" size={24} />
            </TouchableOpacity>
          </View>
        ) : null}
        {playCount > 0 && gameState !== 'guessing' ? (
          <TouchableOpacity style={styles.guessButton}>
            <Text style={styles.buttonText}>Guess Word</Text>
            <Ionicons name="ios-arrow-forward" color="#7c4dff" size={30} />
          </TouchableOpacity>
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
    marginRight: 6
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
  }
});

export default MatchScreen;
