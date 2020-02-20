import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { bool, string } from 'prop-types';

import { getSignedUrl } from '../helpers/apiCaller';

import Layout from '../constants/Layout';

const FFAMatchRow = ({ uri, active, username, categoryName }) => {
  const [signedUri, setSignedUri] = useState('');
  const [buffering, setBuffering] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const video = useRef(null);

  useEffect(() => {
    if (signedUri && !loaded) loadVideo();
    manageVideo();
  }, [active, signedUri]);

  useEffect(() => {
    if (uri) fetchSignedUri();
  }, [uri]);

  const fetchSignedUri = async () => {
    const filename = uri.split('/').pop();
    const signed = await getSignedUrl(filename, 'FFAVideos');
    setSignedUri(signed);
  };

  const loadVideo = async () => {
    await video.current.loadAsync(
      { uri: signedUri, androidImplementation: 'MediaPlayer' },
      { isLooping: true, shouldPlay: active }
    );
  };

  const manageVideo = async () => {
    if (active) await video.current.playAsync();
    else await video.current.pauseAsync();
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
      <Video
        ref={video}
        onPlaybackStatusUpdate={handlePlaybackUpdate}
        resizeMode="cover"
        style={styles.video}
      />
      <View style={styles.info}>
        <Text style={styles.username}>@{username}</Text>
        <Text style={styles.category}>Acting {categoryName}</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Guess Word</Text>
        <FontAwesome5 name="chevron-right" size={14} color="#7c4dff" />
      </TouchableOpacity>
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
  info: {
    bottom: 24,
    left: 24,
    position: 'absolute',
    zIndex: 2
  },
  username: {
    color: '#fff',
    fontFamily: 'sf-medium',
    fontSize: 14,
    marginBottom: 12
  },
  category: {
    color: '#fff',
    fontFamily: 'sf-medium',
    fontSize: 14
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    bottom: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    position: 'absolute',
    right: 24,
    zIndex: 2
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
  buttonText: {
    color: '#7c4dff',
    fontFamily: 'sf-medium',
    fontSize: 12,
    marginRight: 6
  }
});

FFAMatchRow.propTypes = {
  uri: string.isRequired,
  active: bool.isRequired,
  username: string.isRequired,
  categoryName: string.isRequired
};

export default FFAMatchRow;
