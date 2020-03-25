import {
  TOGGLE_PLAY,
  TOGGLE_CATEGORY,
  TOGGLE_ADD,
  TOGGLE_BADGE,
  TOGGLE_PROGRESS_BADGE,
  TOGGLE_NETWORK_MODAL,
  TOGGLE_PURCHASE_POPUP,
  TOGGLE_CATEGORY_PURCHASE,
  TOGGLE_PICK_USERNAME,
  TOGGLE_TERMS,
  TOGGLE_FEEDBACK
} from '../actions/popup';

const initialState = {
  displayPlay: false,
  playCategory: null,
  playFriend: null,
  playMode: null,
  displayCategory: false,
  categoryPopupData: null,
  displayAdd: false,
  badge: {},
  displayProgressBadge: false,
  displayNetworkModal: false,
  displayPurchasePopup: false,
  categoryPurchaseData: null,
  displayCategoryPurchase: false,
  pickUsernameData: null,
  displayPickUsername: false,
  displayTerms: false,
  termsData: null,
  displayFeedback: false
};

const popup = (state = initialState, { type, display, data, badge }) => {
  switch (type) {
    case TOGGLE_PLAY:
      return { ...state, displayPlay: display, ...data };
    case TOGGLE_CATEGORY:
      return { ...state, displayCategory: display, categoryPopupData: data };
    case TOGGLE_CATEGORY_PURCHASE:
      return {
        ...state,
        displayCategoryPurchase: display,
        categoryPurchaseData: data
      };
    case TOGGLE_ADD:
      return { ...state, displayAdd: display };
    case TOGGLE_TERMS:
      return { ...state, displayTerms: display, termsData: data };
    case TOGGLE_BADGE:
      return { ...state, badge };
    case TOGGLE_PROGRESS_BADGE:
      return { ...state, displayProgressBadge: display };
    case TOGGLE_NETWORK_MODAL:
      return { ...state, displayNetworkModal: display };
    case TOGGLE_PURCHASE_POPUP:
      return { ...state, displayPurchasePopup: display };
    case TOGGLE_PICK_USERNAME:
      return { ...state, displayPickUsername: display, pickUsernameData: data };
    case TOGGLE_FEEDBACK:
      return { ...state, displayFeedback: display };
    default:
      return state;
  }
};

export default popup;
