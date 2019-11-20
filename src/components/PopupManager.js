import React from 'react';
import { useApolloClient, useQuery } from '@apollo/react-hooks';

import PlayPopup from './PlayPopup';

import GET_DATA from '../graphql/queries/getPopupData';

const PopupManager = () => {
  const {
    data: { displayPlay, playCategory }
  } = useQuery(GET_DATA);
  const client = useApolloClient();

  const closePlay = () =>
    client.writeData({ data: { displayPlay: false, playCategory: null } });

  return (
    <>
      {displayPlay ? (
        <PlayPopup close={closePlay} category={playCategory} />
      ) : null}
    </>
  );
};

export default PopupManager;
