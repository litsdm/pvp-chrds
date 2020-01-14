import React from 'react';
import { connect } from 'react-redux';
import { bool, func, object, shape, string } from 'prop-types';

import {
  toggleAdd,
  toggleCategory,
  togglePlay,
  toggleBadge,
  toggleProgressBadge,
  togglePurchaseModal
} from '../actions/popup';

import CategoryPopup from './CategoryPopup';
import AddFriendPopup from './AddFriendPopup';
import Badge from './Badge';
import ProgressBadge from './ProgressBadge';
import NetworkErrorModal from './NetworkErrorModal';
import PurchaseModal from './PurchaseModal';

const mapDispatchToProps = dispatch => ({
  closeAdd: () => dispatch(toggleAdd(false)),
  closeCategory: () =>
    dispatch(toggleCategory(false, { selectedCategory: null })),
  showPlay: data => dispatch(togglePlay(true, data)),
  closeBadge: () => dispatch(toggleBadge(false, '')),
  closeProgressBadge: () => dispatch(toggleProgressBadge(false)),
  closePurchaseModal: () => dispatch(togglePurchaseModal(false))
});

const mapStateToProps = ({
  popup: {
    displayCategory,
    selectedCategory,
    transitionPosition,
    displayAdd,
    badge,
    displayProgressBadge,
    displayNetworkModal,
    displayPurchaseModal
  },
  file: { videos }
}) => ({
  displayCategory,
  selectedCategory,
  transitionPosition,
  displayAdd,
  badge,
  videos,
  displayProgressBadge,
  displayNetworkModal,
  displayPurchaseModal
});

const PopupManager = ({
  displayCategory,
  selectedCategory,
  transitionPosition,
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
  closePurchaseModal,
  displayPurchaseModal
}) => {
  const openPlay = _id => () => showPlay({ playCategory: _id });

  return (
    <>
      {displayAdd ? <AddFriendPopup close={closeAdd} /> : null}
      {displayCategory ? (
        <CategoryPopup
          close={closeCategory}
          play={openPlay(selectedCategory._id)}
          transitionPosition={transitionPosition}
          {...selectedCategory}
        />
      ) : null}
      {badge.display ? <Badge close={closeBadge} {...badge} /> : null}
      {displayProgressBadge ? (
        <ProgressBadge close={closeProgressBadge} videos={videos} />
      ) : null}
      {displayNetworkModal ? <NetworkErrorModal /> : null}
      {displayPurchaseModal ? (
        <PurchaseModal close={closePurchaseModal} />
      ) : null}
    </>
  );
};

PopupManager.propTypes = {
  displayCategory: bool.isRequired,
  selectedCategory: object,
  transitionPosition: object,
  displayAdd: bool.isRequired,
  closeAdd: func.isRequired,
  showPlay: func.isRequired,
  closeCategory: func.isRequired,
  closeBadge: func.isRequired,
  displayProgressBadge: bool.isRequired,
  closeProgressBadge: func.isRequired,
  displayNetworkModal: bool.isRequired,
  closePurchaseModal: func.isRequired,
  displayPurchaseModal: bool.isRequired,
  videos: object,
  badge: shape({
    display: bool,
    message: string,
    type: string
  })
};

PopupManager.defaultProps = {
  selectedCategory: null,
  transitionPosition: null,
  badge: {},
  videos: {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PopupManager);
