import AsyncStorage from '@react-native-community/async-storage';

export const ADD_THUMBNAIL = 'ADD_THUMBNAIL';
export const SET_CACHE = 'SET_CACHE';

export const loadLocalCache = () => async dispatch => {
  const cacheString = await AsyncStorage.getItem('cache');

  if (!cacheString) return;

  const cache = JSON.parse(cacheString);
  dispatch(setCache(cache));
};

export const setCache = cache => ({
  cache,
  type: SET_CACHE
});

export const addThumbnail = (_id, thumbnail) => ({
  _id,
  thumbnail,
  type: ADD_THUMBNAIL
});
