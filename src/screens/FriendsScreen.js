import React, { useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  View
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode';
import Fuse from 'fuse.js';
import { func, object } from 'prop-types';

import GET_FRIENDS from '../graphql/queries/getFriends';
import RESOLVE_REQUEST from '../graphql/mutations/resolveFriendRequest';

import { toggleAdd } from '../actions/popup';

import Navbar from '../components/Friends/Navbar';
import FriendRow from '../components/Friends/FriendRow';
import AddFriendRow from '../components/Friends/AddFriendRow';
import Empty from '../components/Friends/Empty';
import Loader from '../components/Loader';

const mapDispatchToProps = dispatch => ({
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

const FriendsScreen = ({ navigation, openAdd }) => {
  const [getFriends, { loading, data, refetch }] = useLazyQuery(GET_FRIENDS);
  const [resolveFriendRequest] = useMutation(RESOLVE_REQUEST);
  const [resolving, setResolving] = useState(false);
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const friends = data ? data.friends : [];
  const friendRequests = data ? data.friendRequests : [];
  const sectionsData = [
    {
      title: 'Friend Requests',
      data: friendRequests
    },
    {
      title: 'Friends',
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

  const goToProfile = _id => () =>
    navigation.navigate('Profile', { userID: _id });

  const resolveRequest = (requestID, type) => async () => {
    if (resolving) return;

    setResolving(true);
    await resolveFriendRequest({ variables: { requestID, type } });
    await refetch();
    setResolving(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const getListTitle = () => {
    if (searching && results.length > 0) return 'Results';
    if (friends.length > 0) return 'Friends';
    return '';
  };

  const getPositionString = (index, title) => {
    let dataLength;

    if (title === 'Friends') dataLength = friends.length;
    else dataLength = friendRequests.length;

    if (searching) dataLength = results.length;

    if (index === 0 && dataLength === index + 1) return 'FirstLast';
    if (index === 0) return 'First';
    if (dataLength === index + 1) return 'Last';

    return 'Mid';
  };

  const renderItem = args => {
    const { _id, from } = args.item;
    const { displayName, profilePic } = from || args.item;

    const title = args.section ? args.section.title : 'Friends';
    const position = getPositionString(args.index, title);

    return (
      <FriendRow
        username={displayName}
        uri={profilePic}
        requestID={from ? _id : null}
        resolveRequest={resolveRequest}
        onPress={goToProfile(_id)}
        position={position}
      />
    );
  };

  const renderContent = () => {
    if (loading) return <Loader />;

    return friendRequests.length > 0 && !searching ? (
      <SectionList
        sections={sectionsData}
        keyExtractor={item => item._id}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <Text
            style={[styles.title, { marginTop: title === 'Friends' ? 24 : 0 }]}
          >
            {title}
          </Text>
        )}
        ListEmptyComponent={<Empty searching={searching} search={search} />}
      />
    ) : (
      <FlatList
        data={searching ? results : friends}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        ListHeaderComponent={<Text style={styles.title}>{getListTitle()}</Text>}
        ListEmptyComponent={<Empty searching={searching} search={search} />}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'never' }}>
      <View style={styles.container}>
        <Navbar
          searching={searching}
          toggleSearch={toggleSearch}
          goBack={goBack}
          onChangeText={handleTextChange}
        />
        <AddFriendRow openPopup={openAdd} />
        {renderContent()}
      </View>
    </SafeAreaView>
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
    fontFamily: 'sf-medium',
    fontSize: 16,
    marginLeft: 12,
    marginBottom: 12,
    opacity: 0.6
  }
});

FriendsScreen.propTypes = {
  navigation: object.isRequired,
  openAdd: func.isRequired
};

export default connect(
  null,
  mapDispatchToProps
)(FriendsScreen);
