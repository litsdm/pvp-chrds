import React from 'react';
import { useApolloClient, useQuery } from '@apollo/react-hooks';

import PlayPopup from './PlayPopup';
import CategoryPopup from './CategoryPopup';
import AddFriendPopup from './AddFriendPopup';

import GET_DATA from '../graphql/queries/getPopupData';

const PopupManager = () => {
  const { data } = useQuery(GET_DATA, { errorPolicy: 'ignore' });
  const client = useApolloClient();

  const {
    displayPlay,
    playCategory,
    playFriend,
    displayCategory,
    selectedCategory,
    transitionPosition,
    displayAdd
  } = data || {};

  const closePlay = () =>
    client.writeData({
      data: { displayPlay: false, playCategory: null, playFriend: null }
    });

  const openPlay = _id => () =>
    client.writeData({ data: { displayPlay: true, playCategory: _id } });

  const closeCategory = () =>
    client.writeData({
      data: { displayCategory: false, selectedCategory: null }
    });

  const closeAdd = () => client.writeData({ data: { displayAdd: false } });

  return (
    <>
      {displayAdd ? <AddFriendPopup close={closeAdd} /> : null}
      {displayPlay ? (
        <PlayPopup
          close={closePlay}
          category={playCategory}
          friend={playFriend}
        />
      ) : null}
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

export default PopupManager;
