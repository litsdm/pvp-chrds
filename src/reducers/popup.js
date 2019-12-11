import {
  TOGGLE_PLAY,
  TOGGLE_CATEGORY,
  TOGGLE_ADD,
  TOGGLE_BADGE
} from '../actions/popup';

const initialState = {
  displayPlay: false,
  playCategory: null,
  playFriend: null,
  displayCategory: false,
  selectedCategory: null,
  transitionPosition: null,
  displayAdd: false,
  badge: {}
};

const popup = (state = initialState, { type, display, data, badge }) => {
  switch (type) {
    case TOGGLE_PLAY:
      return { ...state, displayPlay: display, ...data };
    case TOGGLE_CATEGORY:
      return { ...state, displayCategory: display, ...data };
    case TOGGLE_ADD:
      return { ...state, displayAdd: display };
    case TOGGLE_BADGE:
      return { ...state, badge };
    default:
      return state;
  }
};

export default popup;
