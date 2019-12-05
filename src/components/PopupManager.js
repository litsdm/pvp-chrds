import React from 'react';
import { connect } from 'react-redux';
import { bool, func, object } from 'prop-types';

import { toggleAdd, toggleCategory, togglePlay } from '../actions/popup';

import CategoryPopup from './CategoryPopup';
import AddFriendPopup from './AddFriendPopup';

const mapDispatchToProps = dispatch => ({
  closeAdd: () => dispatch(toggleAdd(false)),
  closeCategory: () =>
    dispatch(toggleCategory(false, { selectedCategory: null })),
  showPlay: data => dispatch(togglePlay(true, data))
});

const mapStateToProps = ({
  popup: { displayCategory, selectedCategory, transitionPosition, displayAdd }
}) => ({
  displayCategory,
  selectedCategory,
  transitionPosition,
  displayAdd
});

const PopupManager = ({
  displayCategory,
  selectedCategory,
  transitionPosition,
  displayAdd,
  closeAdd,
  showPlay,
  closeCategory
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
  closeCategory: func.isRequired
};

PopupManager.defaultProps = {
  selectedCategory: null,
  transitionPosition: null
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PopupManager);
