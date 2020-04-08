import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { getThumbnailAsync } from 'expo-video-thumbnails';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { arrayOf, bool, func, object, shape, string } from 'prop-types';

import { getSignedUrl, getCFSignedUrl } from '../../helpers/apiCaller';

import Layout from '../../constants/Layout';

const MatchColumn = ({ isLast, url, usingCF, cachedThumbnail, addToCache }) => {
  const [thumbnail, setThumbnail] = useState('');

  useEffect(() => {
    if (!cachedThumbnail) fetchThumbnail();
  }, []);

  const fetchThumbnail = async () => {
    try {
      let signedUrl;

      if (usingCF) signedUrl = await signCF();
      else signedUrl = await signS3();

      const { uri } = await getThumbnailAsync(signedUrl, { compress: 0 });

      setThumbnail(uri);
      addToCache(uri);
    } catch (exception) {
      console.warn(exception.message);
    }
  };

  const signS3 = async () => {
    const filename = url.split('/').pop();
    const signed = await getSignedUrl(filename, 'FFAVideos');
    return signed;
  };

  const signCF = async () => {
    const signed = await getCFSignedUrl(url);
    return signed;
  };

  return (
    <TouchableOpacity style={[styles.column, { marginRight: isLast ? 0 : 12 }]}>
      <View style={styles.overlay}>
        <Ionicons name="ios-play" size={30} color="#fff" style={styles.icon} />
        <LinearGradient
          style={styles.gradient}
          colors={['transparent', 'rgba(0, 0, 0, 0.2)']}
          pointerEvents="none"
        />
      </View>
      {cachedThumbnail || thumbnail ? (
        <Image
          source={{ uri: cachedThumbnail || thumbnail }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : null}
    </TouchableOpacity>
  );
};

const MatchRow = ({ matches, thumbnailCache, addToCache }) => {
  const handleAddCache = _id => uri => addToCache(_id, uri);

  const renderColumns = () =>
    matches.map(({ _id, video }, index) => (
      <MatchColumn
        key={_id}
        url={video}
        usingCF={false}
        isLast={index === matches.length - 1}
        cachedThumbnail={thumbnailCache[_id]}
        addToCache={handleAddCache(_id)}
      />
    ));

  return <View style={styles.row}>{renderColumns()}</View>;
};

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    height: (Layout.window.width - 72) / 2,
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
    marginBottom: 12,
    width: Layout.window.width
  },
  column: {
    backgroundColor: '#ddd',
    borderRadius: 8,
    height: (Layout.window.width - 72) / 2,
    width: (Layout.window.width - 72) / 3
  },
  overlay: {
    alignItems: 'center',
    bottom: 0,
    flexDirection: 'row',
    height: (Layout.window.width - 72) / 6,
    left: 0,
    position: 'absolute',
    right: 0,
    width: '100%',
    zIndex: 2
  },
  image: {
    borderRadius: 8,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  },
  gradient: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  },
  icon: {
    marginLeft: 6,
    zIndex: 3
  }
});

MatchRow.propTypes = {
  matches: arrayOf(
    shape({
      _id: string,
      video: string,
      cloudFrontVideo: string
    })
  ).isRequired,
  thumbnailCache: object.isRequired,
  addToCache: func.isRequired
};

MatchColumn.propTypes = {
  url: string.isRequired,
  usingCF: bool.isRequired,
  isLast: bool.isRequired,
  cachedThumbnail: string,
  addToCache: func.isRequired
};

MatchColumn.defaultProps = {
  cachedThumbnail: ''
};

export default MatchRow;
