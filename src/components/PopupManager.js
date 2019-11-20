import React from 'react';
import { useApolloClient, useQuery } from '@apollo/react-hooks';

import PlayPopup from './PlayPopup';
import CategoryPopup from './CategoryPopup';

import GET_DATA from '../graphql/queries/getPopupData';

const PopupManager = () => {
  const {
    data: { displayPlay, playCategory, displayCategory, selectedCategory }
  } = useQuery(GET_DATA);
  const client = useApolloClient();

  const closePlay = () =>
    client.writeData({ data: { displayPlay: false, playCategory: null } });

  const openPlay = _id => () =>
    client.writeData({ data: { displayPlay: true, playCategory: _id } });

  const closeCategory = () =>
    client.writeData({
      data: { displayCategory: false, selectedCategory: null }
    });

  return (
    <>
      {displayPlay ? (
        <PlayPopup close={closePlay} category={playCategory} />
      ) : null}
      {displayCategory ? (
        <CategoryPopup
          close={closeCategory}
          play={openPlay(selectedCategory._id)}
          {...selectedCategory}
        />
      ) : null}
    </>
  );
};

export default PopupManager;
