import { TOGGLE_PLAY, TOGGLE_CATEGORY, TOGGLE_ADD } from '../actions/popup';

const initialState = {
  displayPlay: false,
  playCategory: null,
  playFriend: null,
  displayCategory: false,
  selectedCategory: null,
  transitionPosition: null,
  displayAdd: false
};

const popup = (state = initialState, { type, display, data }) => {
  switch (type) {
    case TOGGLE_PLAY:
      return { ...state, displayPlay: display, ...data };
    case TOGGLE_CATEGORY:
      return { ...state, displayCategory: display, ...data };
    case TOGGLE_ADD:
      return { ...state, displayAdd: display };
    default:
      return state;
  }
};

export default popup;
