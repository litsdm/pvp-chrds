import React from 'react';
import { useApolloClient, useQuery } from '@apollo/react-hooks';

import CategoryPopup from './CategoryPopup';
import AddFriendPopup from './AddFriendPopup';

import GET_DATA from '../graphql/queries/getPopupData';

const PopupManager = () => {
  const { data } = useQuery(GET_DATA, { errorPolicy: 'ignore' });
  const client = useApolloClient();

  const { displayCategory, selectedCategory, transitionPosition, displayAdd } =
    data || {};

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
