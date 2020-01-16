import React, { useEffect, useState } from 'react';
import {
  AsyncStorage,
  FlatList,
  SectionList,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode';
import Fuse from 'fuse.js';
import { func, object } from 'prop-types';

import GET_FRIENDS from '../graphql/queries/getFriends';
import RESOLVE_REQUEST from '../graphql/mutations/resolveFriendRequest';

import { toggleAdd, togglePlay } from '../actions/popup';

import Navbar from '../components/Friends/Navbar';
import FriendRow from '../components/Friends/FriendRow';
import AddFriendRow from '../components/Friends/AddFriendRow';
import Empty from '../components/Friends/Empty';
import Loader from '../components/Loader';

const mapDispatchToProps = dispatch => ({
  showPlay: data => dispatch(togglePlay(true, data)),
  openAdd: () => dispatch(toggleAdd(true))
});

const fuzzyOptions = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 3,
  keys: ['username']
};

const FriendsScreen = ({ navigation, showPlay, openAdd }) => {
  const [getFriends, { loading, data, refetch }] = useLazyQuery(GET_FRIENDS);
  const [resolveFriendRequest] = useMutation(RESOLVE_REQUEST);
  const [resolving, setResolving] = useState(false);
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState('');
  const friends = data ? data.friends : [];
  const friendRequests = data ? data.friendRequests : [];
  const sectionsData = [
    {
      title: 'FRIEND REQUESTS',
      data: friendRequests
    },
    {
      title: 'FRIENDS',
      data: friends
    }
  ];

  const fuse = new Fuse(friends, fuzzyOptions);
  const results = fuse.search(search);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!searching && search) setSearch('');
  }, [searching]);

  const fetchData = async () => {
    const token = await AsyncStorage.getItem('CHRDS_TOKEN');
    const { _id } = jwtDecode(token);
    getFriends({ variables: { _id } });
  };

  const handleTextChange = text => setSearch(text);
  const toggleSearch = () => setSearching(!searching);
  const goBack = () => navigation.goBack();

  const openPlay = _id => () => showPlay({ playFriend: _id });

  const resolveRequest = (requestID, type) => async () => {
    if (resolving) return;

    await setResolving(true);
    await resolveFriendRequest({ variables: { requestID, type } });
    await refetch();
    setResolving(false);
  };

  const renderItem = args => {
    const { _id, from } = args.item;
    const { displayName, profilePic } = from || args.item;
    return (
      <FriendRow
        username={displayName}
        uri={profilePic}
        requestID={from ? _id : null}
        resolveRequest={resolveRequest}
        onPress={openPlay(_id)}
      />
    );
  };

  const renderContent = () => {
    if (loading) return <Loader />;
    if (
      (friends.length <= 0 && friendRequests.length <= 0) ||
      (searching && results.length <= 0)
    )
      return (
        <>
          <AddFriendRow openPopup={openAdd} />
          <Empty searching={searching} search={search} />
        </>
      );

    return (
      <>
        <AddFriendRow openPopup={openAdd} />
        {friendRequests.length > 0 && !searching ? (
          <SectionList
            sections={sectionsData}
            keyExtractor={item => item._id}
            renderItem={renderItem}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.title}>{title}</Text>
            )}
          />
        ) : (
          <FlatList
            data={searching ? results : friends}
            renderItem={renderItem}
            keyExtractor={item => item._id}
          />
        )}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Navbar
        searching={searching}
        toggleSearch={toggleSearch}
        goBack={goBack}
        onChangeText={handleTextChange}
      />
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FCFCFE',
    overflow: 'hidden',
    flex: 1,
    paddingTop: 54,
    paddingBottom: 12
  },
  title: {
    fontFamily: 'sf-light',
    fontSize: 14,
    marginBottom: 6,
    marginLeft: 12,
    marginTop: 12,
    opacity: 0.4
  }
});

FriendsScreen.propTypes = {
  navigation: object.isRequired,
  showPlay: func.isRequired,
  openAdd: func.isRequired
};

export default connect(
  null,
  mapDispatchToProps
)(FriendsScreen);
