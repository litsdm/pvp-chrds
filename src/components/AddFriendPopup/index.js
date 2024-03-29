import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import Fuse from 'fuse.js';
import jwtDecode from 'jwt-decode';
import Share from 'react-native-share';
import { func } from 'prop-types';

import GET_SEARCH_FRIENDS from '../../graphql/queries/getSearchFriends';
import CREATE_FRIEND_REQUEST from '../../graphql/mutations/createFriendRequest';

import Popup from '../Popup';
import Loader from '../Loader';
import SearchBar from './SearchBar';
import FriendRow from './FriendRow';
import Empty from '../Empty';

import Layout from '../../constants/Layout';

const fuzzyOptions = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 3,
  keys: ['username']
};

const AddFriendPopup = ({ close }) => {
  const [getSearchFriends, { loading, data }] = useLazyQuery(
    GET_SEARCH_FRIENDS
  );
  const [createFriendRequest] = useMutation(CREATE_FRIEND_REQUEST);
  const [search, setSearch] = useState('');
  const [added, setAdded] = useState({});
  const [userID, setUserID] = useState('');
  const searchFriends = data ? data.searchFriends : [];

  const fuse = new Fuse(searchFriends, fuzzyOptions);

  const results = fuse.search(search);

  useEffect(() => {
    fetchUserID();
  }, []);

  const fetchUserID = async () => {
    const token = await AsyncStorage.getItem('CHRDS_TOKEN');
    const { _id } = jwtDecode(token);
    setUserID(_id);
  };

  const fetchSearchFriends = async text => {
    getSearchFriends({ variables: { _id: userID, text } });
  };

  const handleTextChange = text => {
    if (text && text.length < 3) {
      fetchSearchFriends(text.toLowerCase());
    }
    setSearch(text);
  };

  const handleAdd = friendID => async () => {
    if (added[friendID]) return;
    const token = await AsyncStorage.getItem('CHRDS_TOKEN');
    const { _id } = jwtDecode(token);

    setAdded({ ...added, [friendID]: true });

    await createFriendRequest({ variables: { to: friendID, from: _id } });
  };

  const handleInvite = async () => {
    const options = {
      message:
        'Play Charades with me! Just download the app at bit.ly/CHRDS to start playing.',
      title: 'Play Charades online',
      subject: 'Play Charades online'
    };

    await Share.open(options);
  };

  const renderItem = args => {
    const { _id, displayName, profilePic } = args.item.item;
    return (
      <FriendRow
        username={displayName}
        uri={profilePic}
        add={handleAdd(_id)}
        added={added[_id]}
      />
    );
  };

  return (
    <Popup
      close={close}
      contentStyles={styles.popupContent}
      avoidKeyboard={false}
    >
      <View style={styles.container}>
        <SearchBar search={search} onChangeText={handleTextChange} />
        {loading ? (
          <Loader containerStyle={styles.loaderStyles} />
        ) : (
          <>
            {results.length > 0 ? (
              <FlatList
                data={results}
                keyExtractor={item => item._id}
                renderItem={renderItem}
              />
            ) : (
              <Empty
                title="No results for your search."
                description="Are your friends not on CHRDS? Invite them!"
                action={handleInvite}
                actionTitle="Invite a Friend"
              />
            )}
          </>
        )}
      </View>
    </Popup>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 24
  },
  popupContent: {
    height: Layout.window.height - 104
  },
  loaderStyles: {
    marginTop: 120
  }
});

AddFriendPopup.propTypes = {
  close: func.isRequired
};

export default AddFriendPopup;
