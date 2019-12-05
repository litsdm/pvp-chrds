import { combineReducers } from 'redux';
import file from './file';
import popup from './popup';

import { LOGOUT } from '../actions/user';

const appReducer = combineReducers({
  file,
  popup
});

const rootReducer = (state, action) => {
  const appState = action.type === LOGOUT ? undefined : state;
  return appReducer(appState, action);
};

export default rootReducer;
