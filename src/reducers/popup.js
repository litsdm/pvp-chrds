import {
  TOGGLE_PLAY,
  TOGGLE_CATEGORY,
  TOGGLE_ADD,
  TOGGLE_BADGE,
  TOGGLE_PROGRESS_BADGE,
  TOGGLE_NETWORK_MODAL,
  TOGGLE_PURCHASE_MODAL,
  TOGGLE_CATEGORY_PURCHASE,
  TOGGLE_PICK_USERNAME
} from '../actions/popup';

const initialState = {
  displayPlay: false,
  playCategory: null,
  playFriend: null,
  displayCategory: false,
  selectedCategory: null,
  transitionPosition: null,
  displayAdd: false,
  badge: {},
  displayProgressBadge: false,
  displayNetworkModal: false,
  displayPurchaseModal: false,
  categoryPurchaseData: null,
  displayCategoryPurchase: false,
  pickUsernameData: null,
  displayPickUsername: false
};

const popup = (state = initialState, { type, display, data, badge }) => {
  switch (type) {
    case TOGGLE_PLAY:
      return { ...state, displayPlay: display, ...data };
    case TOGGLE_CATEGORY:
      return { ...state, displayCategory: display, ...data };
    case TOGGLE_CATEGORY_PURCHASE:
      return {
        ...state,
        displayCategoryPurchase: display,
        categoryPurchaseData: data
      };
    case TOGGLE_ADD:
      return { ...state, displayAdd: display };
    case TOGGLE_BADGE:
      return { ...state, badge };
    case TOGGLE_PROGRESS_BADGE:
      return { ...state, displayProgressBadge: display };
    case TOGGLE_NETWORK_MODAL:
      return { ...state, displayNetworkModal: display };
    case TOGGLE_PURCHASE_MODAL:
      return { ...state, displayPurchaseModal: display };
    case TOGGLE_PICK_USERNAME:
      return { ...state, displayPickUsername: display, pickUsernameData: data };
    default:
      return state;
  }
};

export default popup;
