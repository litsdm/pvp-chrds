import React, { useEffect, useState } from 'react';
import {
  AsyncStorage,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useLazyQuery } from '@apollo/react-hooks';
import { Ionicons } from '@expo/vector-icons';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import jwtDecode from 'jwt-decode';

import GET_FRIENDS from '../graphql/queries/getFriends';

import Navbar from '../components/Friends/Navbar';
import FriendRow from '../components/Friends/FriendRow';

const PRE_ICON = Platform.OS === 'ios' ? 'ios' : 'md';

const FriendsScreen = ({ navigation }) => {
  const [getFriends, { loading, data }] = useLazyQuery(GET_FRIENDS);
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState('');
  const friends = data ? data.friends : [];

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    const token = await AsyncStorage.getItem('CHRDS_TOKEN');
    const { _id } = jwtDecode(token);
    getFriends({ variables: { _id } });
  };

  const handleTextChange = text => setSearch(text);
  const toggleSearch = () => setSearching(!searching);
  const goBack = () => navigation.goBack();

  const renderItem = args => {
    const { username, profilePic } = args.item;
    return <FriendRow username={username} uri={profilePic} />;
  };

  return (
    <View style={styles.container}>
      <Navbar
        searching={searching}
        toggleSearch={toggleSearch}
        goBack={goBack}
        onChangeText={handleTextChange}
      />
      <TouchableOpacity style={styles.add}>
        <View style={styles.icon}>
          <Ionicons name={`${PRE_ICON}-person-add`} size={24} color="#fff" />
        </View>
        <Text style={styles.rowText}>Add Friend</Text>
      </TouchableOpacity>
      <FlatList
        data={friends}
        renderItem={renderItem}
        keyExtractor={item => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FCFCFE',
    overflow: 'hidden',
    flex: 1,
    paddingTop: getStatusBarHeight() + 54,
    paddingBottom: 12
  },
  add: {
    alignItems: 'center',
    backgroundColor: '#FDFDFF',
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  icon: {
    alignItems: 'center',
    backgroundColor: '#7c4dff',
    borderRadius: 42 / 2,
    height: 42,
    justifyContent: 'center',
    marginRight: 12,
    width: 42
  },
  rowText: {
    fontFamily: 'sf-medium',
    fontSize: 18
  }
});

export default FriendsScreen;
