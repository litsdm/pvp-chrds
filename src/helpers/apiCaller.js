/* global __DEV__ */
import AsyncStorage from '@react-native-community/async-storage';

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
      if (lengthComputable) progressCb(file.name, loaded / total, loaded);
    }
  );
  oReq.addEventListener('error', e => errorCb(e));
  oReq.open('PUT', signedRequest);
  oReq.setRequestHeader('Content-Type', file.type);
  oReq.send(file);
};

export const uploadChunk = (
  file,
  fileData,
  signedRequest,
  progressCb,
  finishCb,
  start = null,
  errorCb = () => {}
) => {
  const chunk = file.slice(start || 0, file.size);
  const oReq = new XMLHttpRequest();
  oReq.addEventListener('load', () => finishCb(fileData));
  oReq.upload.addEventListener(
    'progress',
    ({ loaded, total, lengthComputable }) => {
      if (lengthComputable) progressCb(fileData.name, loaded / total, loaded);
    }
  );
  oReq.addEventListener('error', e => errorCb(e));
  oReq.open('PUT', signedRequest);
  oReq.setRequestHeader('Content-Type', fileData.type);
  oReq.send(chunk);
};

export const getSignedUrl = async (s3Filename, folder) => {
  try {
    const response = await callApi(
      `s3/get?file-name=${s3Filename}&folder=${folder}`
    );
    const { signedRequest } = await response.json();
    return signedRequest;
  } catch (exception) {
    throw new Error(`[apiCaller.getSignedUrl] ${exception.message}`);
  }
};

export const getApiUrl = (isSocket = false) =>
  __DEV__
    ? `${isSocket ? 'ws' : 'http'}://192.168.15.10:8080`
    : `${isSocket ? 'ws' : 'https'}://morning-lake-75927.herokuapp.com`;

export default callApi;
