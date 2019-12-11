import React from 'react';
import { connect } from 'react-redux';
import { bool, func, object, shape, string } from 'prop-types';

import {
  toggleAdd,
  toggleCategory,
  togglePlay,
  toggleBadge
} from '../actions/popup';

import CategoryPopup from './CategoryPopup';
import AddFriendPopup from './AddFriendPopup';
import Badge from './Badge';

const mapDispatchToProps = dispatch => ({
  closeAdd: () => dispatch(toggleAdd(false)),
  closeCategory: () =>
    dispatch(toggleCategory(false, { selectedCategory: null })),
  showPlay: data => dispatch(togglePlay(true, data)),
  closeBadge: () => dispatch(toggleBadge(false, ''))
});

const mapStateToProps = ({
  popup: {
    displayCategory,
    selectedCategory,
    transitionPosition,
    displayAdd,
    badge
  }
}) => ({
  displayCategory,
  selectedCategory,
  transitionPosition,
  displayAdd,
  badge
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
  closeBadge
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
  badge: shape({
    display: bool,
    message: string,
    type: string
  })
};

PopupManager.defaultProps = {
  selectedCategory: null,
  transitionPosition: null,
  badge: {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PopupManager);
