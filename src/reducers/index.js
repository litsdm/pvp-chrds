import { combineReducers } from 'redux';
import file from './file';
import popup from './popup';
import user from './user';
import cache from './cache';

import { LOGOUT } from '../actions/user';

const appReducer = combineReducers({
  file,
  popup,
  user,
  cache
});

const rootReducer = (state, action) => {
  const appState = action.type === LOGOUT ? undefined : state;
  return appReducer(appState, action);
};

export default rootReducer;
