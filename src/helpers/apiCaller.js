/* global __DEV__ */
import { AsyncStorage } from 'react-native';

const callApi = async (endpoint, body, method = 'GET') => {
  const token = (await AsyncStorage.getItem('CHRDS_TOKEN')) || null;
  const apiUrl = getApiUrl();

  return fetch(`${apiUrl}/api/${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });
};

export const uploadFile = (
  file,
  signedRequest,
  progressCb,
  finishCb,
  errorCb = () => {}
) => {
  const oReq = new XMLHttpRequest();
  oReq.addEventListener('load', () => finishCb(file));
  oReq.upload.addEventListener(
    'progress',
    ({ loaded, total, lengthComputable }) => {
      if (lengthComputable) progressCb(file.id, loaded / total);
    }
  );
  oReq.addEventListener('error', e => errorCb(e));
  oReq.open('PUT', signedRequest);
  oReq.setRequestHeader('Content-Type', file.type);
  oReq.send(file);
};

export const getSignedUrl = async s3Filename => {
  try {
    const response = await callApi(`get-s3?file-name=${s3Filename}`);
    const { signedRequest } = await response.json();
    return signedRequest;
  } catch (exception) {
    throw new Error(`[apiCaller.getSignedUrl] ${exception.message}`);
  }
};

export const getApiUrl = () =>
  __DEV__
    ? 'http://192.168.15.3:8080'
    : 'https://tempo-share-web.herokuapp.com';

export default callApi;
