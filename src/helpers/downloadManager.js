import { useState } from 'react';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const ensureDirectoryExists = async path => {
  const { exists } = await FileSystem.getInfoAsync(path);
  if (!exists) await FileSystem.makeDirectoryAsync(path);
};

const createAssetAndLink = async uri => {
  const asset = await MediaLibrary.createAssetAsync(uri);
  const albumName = 'Charades Saved';

  let album = await MediaLibrary.getAlbumAsync(albumName);
  if (!album)
    album = await MediaLibrary.createAlbumAsync(albumName, asset, false);
  else await MediaLibrary.addAssetsToAlbumAsync(asset, album, false);
};

const useDownload = () => {
  const [progress, setProgress] = useState(0);
  const [inProgress, setInProgress] = useState(false);
  const [downloadUri, setDownloadUri] = useState(null);
  const [sessionDownloadCache, setDownloadCache] = useState({});

  const data = { progress, inProgress, downloadUri };

  const handleProgress = async ({
    totalBytesWritten,
    totalBytesExpectedToWrite
  }) => {
    const newProgress = totalBytesWritten / totalBytesExpectedToWrite;

    if (newProgress === 1) {
      setInProgress(false);
      return;
    }

    setProgress(newProgress);
  };

  const download = async (fileURL, saveToRoll = false) => {
    if (sessionDownloadCache[fileURL]) return sessionDownloadCache[fileURL];

    setInProgress(true);

    try {
      const name = fileURL.split('/').pop();
      const directoryUri = saveToRoll
        ? `${FileSystem.documentDirectory}Charades/`
        : FileSystem.cacheDirectory;
      const outputUri = `${directoryUri}${name}`;

      const resumableDownload = FileSystem.createDownloadResumable(
        fileURL,
        outputUri,
        {},
        handleProgress
      );

      await ensureDirectoryExists(directoryUri);

      const { uri } = await resumableDownload.downloadAsync();
      setDownloadUri(uri);
      setDownloadCache({ ...sessionDownloadCache, fileURL: uri });

      if (saveToRoll) createAssetAndLink(uri);

      return uri;
    } catch (exception) {
      console.warn(exception.message);
      setInProgress(false);
    }
  };

  return [download, data];
};

export default useDownload;
