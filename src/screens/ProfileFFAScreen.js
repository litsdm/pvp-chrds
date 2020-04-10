import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { DataProvider } from 'recyclerlistview';
import { object } from 'prop-types';

import GET_DATA from '../graphql/queries/getProfileFFAData';
import GET_USER_DATA from '../graphql/queries/getFFAUserData';

import MatchRecyclerView from '../components/FFA/MatchRecyclerView';

const provider = new DataProvider((a, b) => a._id !== b._id);

let _guessing;

const ProfileFFAScreen = ({ navigation }) => {
  const userID = navigation.getParam('userID', '');
  const profileUserID = navigation.getParam('profileUserID', '');
  const initialRenderIndex = navigation.getParam('initialRenderIndex', 0);
  const { data } = useQuery(GET_DATA, { variables: { _id: profileUserID } });
  const { data: userData, refetch: refetchUser } = useQuery(GET_USER_DATA, {
    variables: { userID }
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [dataProvider, setDataProvider] = useState(null);
  const [guessed, setGuessed] = useState({});
  const [guessing, setGuessing] = useState(false);

  const user = userData ? userData.user : {};

  _guessing = guessing;

  useEffect(() => {
    if (data && data.matches && data.matches.length > 0)
      setDataProvider(provider.cloneWithRows(data.matches));
  }, [data]);

  useEffect(() => {
    if (userData && userData.user) {
      const { ffaGuessed } = userData.user;
      setGuessed(JSON.parse(ffaGuessed || '{}'));
    }
  }, [userData]);

  const addToGuessed = _id => result =>
    setGuessed({ ...guessed, [_id]: result });

  const goBack = () => {
    if (_guessing) setGuessing(false);
    else {
      navigation.goBack();
      return true;
    }
    return false;
  };

  const handleBlockUser = () => {
    navigation.goBack();
  };

  const handleCreateOwn = () =>
    navigation.navigate('Home', { userID, playFromFFA: true });

  const handleIndexChange = indeces => {
    if (indeces.length === 1) setActiveIndex(indeces[0]);
  };

  return (
    <MatchRecyclerView
      user={user}
      refetchUser={refetchUser}
      goBack={goBack}
      onVisibleIndicesChanged={handleIndexChange}
      handleEmptyCreate={handleCreateOwn}
      onBlockUser={handleBlockUser}
      guessed={guessed}
      addToGuessed={addToGuessed}
      guessing={guessing}
      activeIndex={activeIndex}
      setGuessing={setGuessing}
      dataProvider={dataProvider}
      isSelf={userID === profileUserID}
      initialRenderIndex={initialRenderIndex}
    />
  );
};

ProfileFFAScreen.propTypes = {
  navigation: object.isRequired
};

export default ProfileFFAScreen;
