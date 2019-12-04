import { combineReducers } from 'redux';
import file from './file';

import { LOGOUT } from '../actions/user';

const appReducer = combineReducers({
  file
});

const rootReducer = (state, action) => {
  const appState = action.type === LOGOUT ? undefined : state;
  return appReducer(appState, action);
};

export default rootReducer;
