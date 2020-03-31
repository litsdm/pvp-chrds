import React from 'react';
import { connect } from 'react-redux';
import { arrayOf, bool, func, number, object, shape, string } from 'prop-types';

import {
  toggleAdd,
  toggleCategory,
  togglePlay,
  toggleBadge,
  toggleProgressBadge,
  togglePurchasePopup,
  toggleCategoryPurchase,
  togglePickUsername,
  toggleTerms,
  toggleFeedback,
  toggleSuggest
} from '../actions/popup';

import CategoryPopup from './CategoryPopup';
import AddFriendPopup from './AddFriendPopup';
import Badge from './Badge';
import ProgressBadge from './ProgressBadge';
import NetworkErrorModal from './NetworkErrorModal';
import PurchasePopup from './PurchasePopup';
import CategoryPurchase from './CategoryPurchase';
import PickUsername from './PickUsernameModal';
import TermsPopup from './TermsPopup';
import FeedbackPopup from './Settings/FeedbackPopup';
import SuggestPopup from './SuggestPopup';

const mapDispatchToProps = dispatch => ({
  closeAdd: () => dispatch(toggleAdd(false)),
  closeCategory: () =>
    dispatch(toggleCategory(false, { selectedCategory: null })),
  showPlay: data => dispatch(togglePlay(true, data)),
  closeBadge: () => dispatch(toggleBadge(false, '')),
  closeProgressBadge: () => dispatch(toggleProgressBadge(false)),
  closePurchasePopup: () => dispatch(togglePurchasePopup(false)),
  closeCategoryPurchase: () => dispatch(toggleCategoryPurchase(false)),
  openStore: () => dispatch(togglePurchasePopup(true)),
  closePickUsername: () => dispatch(togglePickUsername(false)),
  displayBadge: (message, type) => dispatch(toggleBadge(true, message, type)),
  openCategoryPurchase: data => dispatch(toggleCategoryPurchase(true, data)),
  closeTerms: () => dispatch(toggleTerms(false)),
  closeFeedback: () => dispatch(toggleFeedback(false)),
  closeSuggest: () => dispatch(toggleSuggest(false))
});

const mapStateToProps = ({
  popup: {
    displayCategory,
    categoryPopupData,
    displayAdd,
    badge,
    displayProgressBadge,
    displayNetworkModal,
    displayPurchasePopup,
    categoryPurchaseData,
    displayCategoryPurchase,
    displayPickUsername,
    pickUsernameData,
    displayTerms,
    termsData,
    displayFeedback,
    displaySuggest
  },
  file: { videos }
}) => ({
  displayCategory,
  categoryPopupData,
  displayAdd,
  badge,
  videos,
  displayProgressBadge,
  displayNetworkModal,
  displayPurchasePopup,
  categoryPurchaseData,
  displayCategoryPurchase,
  displayPickUsername,
  pickUsernameData,
  displayTerms,
  termsData,
  displayFeedback,
  displaySuggest
});

const PopupManager = ({
  displayCategory,
  categoryPopupData,
  displayAdd,
  closeAdd,
  showPlay,
  closeCategory,
  badge,
  closeBadge,
  displayProgressBadge,
  closeProgressBadge,
  videos,
  displayNetworkModal,
  closePurchasePopup,
  displayPurchasePopup,
  categoryPurchaseData,
  displayCategoryPurchase,
  closeCategoryPurchase,
  openStore,
  displayPickUsername,
  pickUsernameData,
  closePickUsername,
  displayBadge,
  openCategoryPurchase,
  displayTerms,
  closeTerms,
  termsData,
  displayFeedback,
  closeFeedback,
  displaySuggest,
  closeSuggest
}) => {
  const openPlay = _id => () => showPlay({ playCategory: _id });

  return (
    <>
      {displayAdd ? <AddFriendPopup close={closeAdd} /> : null}
      {displayCategory ? (
        <CategoryPopup
          close={closeCategory}
          play={openPlay(categoryPopupData.category._id)}
          openPurchase={openCategoryPurchase}
          {...categoryPopupData}
        />
      ) : null}
      {badge.display ? <Badge close={closeBadge} {...badge} /> : null}
      {displayProgressBadge ? (
        <ProgressBadge close={closeProgressBadge} videos={videos} />
      ) : null}
      {displayNetworkModal ? <NetworkErrorModal /> : null}
      {displayCategoryPurchase ? (
        <CategoryPurchase
          close={closeCategoryPurchase}
          category={categoryPurchaseData.category}
          user={categoryPurchaseData.user}
          openStore={openStore}
        />
      ) : null}
      {displayPurchasePopup ? (
        <PurchasePopup close={closePurchasePopup} />
      ) : null}
      {displayPickUsername ? (
        <PickUsername
          close={closePickUsername}
          displayBadge={displayBadge}
          {...pickUsernameData}
        />
      ) : null}
      {displayTerms ? <TermsPopup close={closeTerms} {...termsData} /> : null}
      {displayFeedback ? (
        <FeedbackPopup close={closeFeedback} displayBadge={displayBadge} />
      ) : null}
      {displaySuggest ? <SuggestPopup close={closeSuggest} /> : null}
    </>
  );
};

PopupManager.propTypes = {
  displayCategory: bool.isRequired,
  categoryPopupData: shape({
    transitionPosition: object,
    user: object,
    category: object,
    hasCategory: bool
  }),
  displayAdd: bool.isRequired,
  closeAdd: func.isRequired,
  showPlay: func.isRequired,
  closeCategory: func.isRequired,
  closeBadge: func.isRequired,
  displayProgressBadge: bool.isRequired,
  closeProgressBadge: func.isRequired,
  displayNetworkModal: bool.isRequired,
  closePurchasePopup: func.isRequired,
  displayPurchasePopup: bool.isRequired,
  videos: object,
  badge: shape({
    display: bool,
    message: string,
    type: string
  }),
  categoryPurchaseData: shape({
    category: shape({
      _id: string,
      image: string,
      name: string,
      price: number
    }),
    user: shape({
      _id: string,
      categories: arrayOf(string),
      coins: number
    })
  }),
  displayCategoryPurchase: bool.isRequired,
  closeCategoryPurchase: func.isRequired,
  openStore: func.isRequired,
  displayPickUsername: bool.isRequired,
  pickUsernameData: shape({
    name: string,
    appleID: string,
    onSuccess: func
  }),
  closePickUsername: func.isRequired,
  displayBadge: func.isRequired,
  openCategoryPurchase: func.isRequired,
  displayTerms: bool.isRequired,
  closeTerms: func.isRequired,
  termsData: object,
  displayFeedback: bool.isRequired,
  closeFeedback: func.isRequired,
  displaySuggest: bool.isRequired,
  closeSuggest: func.isRequired
};

PopupManager.defaultProps = {
  categoryPurchaseData: null,
  badge: {},
  videos: {},
  pickUsernameData: {},
  categoryPopupData: {},
  termsData: {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PopupManager);
