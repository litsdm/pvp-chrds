import React from 'react';
import { useApolloClient, useQuery } from '@apollo/react-hooks';

import PlayPopup from './PlayPopup';

import GET_VISIBLE from '../graphql/queries/getVisiblePopups';

const PopupManager = () => {
  const { data } = useQuery(GET_VISIBLE);
  const client = useApolloClient();

  const closePlay = () => client.writeData({ data: { displayPlay: false } });

  return (
    <>{data && data.displayPlay ? <PlayPopup close={closePlay} /> : null}</>
  );
};

export default PopupManager;
