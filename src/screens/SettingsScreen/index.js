import React, { useState, useEffect } from 'react';
import {
  Image,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  useApolloClient,
  useLazyQuery,
  useMutation
} from '@apollo/react-hooks';
import { connect } from 'react-redux';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import jwtDecode from 'jwt-decode';
import { bool, func, number, object } from 'prop-types';

import mime from '../../helpers/mimeTypes';
import { facebookAuth } from '../AuthScreen';

import GET_DATA from '../../graphql/queries/getHomeData';
import UPDATE_USER from '../../graphql/mutations/updateUser';
import ADD_FRIENDS from '../../graphql/mutations/addFBFriends';

import Layout from '../../constants/Layout';
import { useAnimation } from '../../helpers/hooks';
import { uploadPic } from '../../actions/file';
import { logoutUser } from '../../actions/user';
import {
  toggleBadge,
  toggleFeedback,
  toggleSuggest,
  togglePro
} from '../../actions/popup';

import AnimatedNav from '../../components/AnimatedNav';
import Crown from '../../../assets/icons/crown.svg';

const mapDispatchToProps = dispatch => ({
  uploadFile: (file, onFinish) => dispatch(uploadPic(file, onFinish)),
  resetReduxState: () => dispatch(logoutUser()),
  displayBadge: (message, type) => dispatch(toggleBadge(true, message, type)),
  showFeedback: () => dispatch(toggleFeedback(true)),
  showSuggest: () => dispatch(toggleSuggest(true)),
  showProModal: () => dispatch(togglePro(true, 'suggest'))
});

const mapStateToProps = ({ file: { uploadingPic, picProgress } }) => ({
  uploading: uploadingPic,
  progress: picProgress
});

const PRE_ICON = Platform.OS === 'ios' ? 'ios' : 'md';

const SettingsScreen = ({
  navigation,
  uploadFile,
  progress,
  uploading,
  resetReduxState,
  displayBadge,
  showFeedback,
  showSuggest,
  showProModal
}) => {
  const [getData, { data, refetch }] = useLazyQuery(GET_DATA);
  const [updateUser] = useMutation(UPDATE_USER);
  const [addFriends] = useMutation(ADD_FRIENDS);
  const [displayingNavbar, setDisplayingNavbar] = useState(false);
  const { animationValue, animateTo } = useAnimation();
  const client = useApolloClient();

  const user = data ? data.user : {};
  const friendRequests = data ? data.friendRequests : [];
  const frCount = friendRequests.length;

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const token = await AsyncStorage.getItem('CHRDS_TOKEN');
    const { _id } = jwtDecode(token);
    getData({ variables: { _id } });
  };

  const goBack = () => navigation.navigate('Profile');
  const sendSMS = () => Linking.openURL('sms:+5215566096148');
  const sendEmail = () => Linking.openURL('mailto:pame.aridjis@gmail.com');
  const goToGeneral = () => navigation.navigate('General');
  const goToPrivacy = () =>
    navigation.navigate('Privacy', { userID: user._id });
  const goToFriends = () => navigation.navigate('Friends');
  const goToProfile = () =>
    navigation.navigate('Profile', {
      userID: user._id,
      profileUserID: user._id
    });
  const rateApp = () => {
    // itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?type=Purple+Software&id=1496562540
    const url =
      Platform.OS === 'ios'
        ? 'itms-apps://itunes.apple.com/gb/app/id1496562540?action=write-review&mt=8'
        : 'https://play.google.com/store/apps/details?id=com.cdiezmoran.chrds';
    Linking.openURL(url);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('CHRDS_TOKEN');
    client.resetStore();
    resetReduxState();
    navigation.navigate('Auth');
  };

  const connectWithFacebook = async () => {
    const fbUser = await facebookAuth();
    const properties = JSON.stringify({ facebookID: fbUser.id });

    const friendIDs = fbUser.friends.map(friend => friend.id);
    await addFriends({ variables: { _id: user._id, friendIDs } });

    await updateUser({ variables: { id: user._id, properties } });

    refetch();
  };

  const disconnectFB = async () => {
    const properties = JSON.stringify({ facebookID: '' });
    await updateUser({ variables: { id: user._id, properties } });
    refetch();
  };

  const handleUploadFinish = () => refetch();

  const handleSuggest = () => {
    if (!user.isPro) {
      showProModal();
      return;
    }

    showSuggest();
  };

  const pickImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (status !== 'granted') {
      displayBadge(
        'CHRDS requires access to your camera roll to change your profile pic. Please enable it on your phone settings.'
      );
      return;
    }

    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    });

    if (cancelled) return;

    const { size } = await FileSystem.getInfoAsync(uri, { size: true });
    const extension = uri.split('.').pop();
    const filename = `${user._id}-pp-.${extension}`;

    const file = {
      uri,
      size,
      type: mime(extension),
      name: filename,
      userID: user._id
    };

    uploadFile(file, handleUploadFinish);
  };

  const handleScroll = ({
    nativeEvent: {
      contentOffset: { y }
    }
  }) => {
    if (y >= 162 && !displayingNavbar) {
      animateTo(1);
      setDisplayingNavbar(true);
    } else if (y < 162 && displayingNavbar) {
      animateTo(0);
      setDisplayingNavbar(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'never' }}>
      <AnimatedNav
        animationValue={animationValue}
        goBack={goBack}
        uri={user.profilePic}
      />
      <ScrollView onScroll={handleScroll} scrollEventThrottle={8}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.goBack} onPress={goBack}>
              <Ionicons name="ios-arrow-round-back" color="#000" size={30} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageWrapper} onPress={goToProfile}>
              {uploading ? (
                <View style={styles.progressOverlay}>
                  <Text style={styles.progress}>
                    {Math.round(progress * 100)}%
                  </Text>
                </View>
              ) : null}
              <Image
                style={styles.profilePic}
                source={{ uri: user.profilePic }}
              />
              <TouchableOpacity style={styles.editImage} onPress={pickImage}>
                <FontAwesome5 name="pen" size={18} color="#000" />
              </TouchableOpacity>
            </TouchableOpacity>
            <Text style={styles.username}>@{user.displayName}</Text>
          </View>
          <View style={styles.content}>
            <View style={styles.group}>
              <TouchableOpacity style={styles.row} onPress={rateApp}>
                <View style={styles.info}>
                  <View
                    style={[styles.iconWrap, { backgroundColor: '#FFC107' }]}
                  >
                    <Ionicons
                      color="#fff"
                      name={`${PRE_ICON}-star`}
                      size={28}
                    />
                  </View>
                  <Text style={[styles.rowText, { textAlign: 'center' }]}>
                    Rate the app!
                  </Text>
                </View>
                <Ionicons
                  name="ios-arrow-forward"
                  color="rgba(0,0,0,0.1)"
                  size={24}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.group}>
              <TouchableOpacity style={styles.row} onPress={goToGeneral}>
                <View style={styles.info}>
                  <View style={styles.iconWrap}>
                    <Ionicons color="#fff" name={`${PRE_ICON}-cog`} size={28} />
                  </View>
                  <Text style={styles.rowText}>General</Text>
                </View>
                <Ionicons
                  name="ios-arrow-forward"
                  color="rgba(0,0,0,0.1)"
                  size={24}
                />
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.row} onPress={goToPrivacy}>
                <View style={styles.info}>
                  <View style={[styles.iconWrap, styles.secondary]}>
                    <Ionicons color="#fff" name={`${PRE_ICON}-key`} size={28} />
                  </View>
                  <Text style={styles.rowText}>Privacy</Text>
                </View>
                <Ionicons
                  name="ios-arrow-forward"
                  color="rgba(0,0,0,0.1)"
                  size={24}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.group}>
              <TouchableOpacity style={styles.row} onPress={goToFriends}>
                <View style={styles.info}>
                  <View style={styles.iconWrap}>
                    <Ionicons
                      color="#fff"
                      name={`${PRE_ICON}-contacts`}
                      size={28}
                    />
                  </View>
                  <Text style={styles.rowText}>Friends</Text>
                </View>
                <View style={styles.icons}>
                  {frCount > 0 ? (
                    <View style={styles.badge}>
                      <Text
                        style={[
                          styles.badgeText,
                          { fontSize: frCount < 10 ? 12 : 10 }
                        ]}
                      >
                        {frCount < 10 ? frCount : '9+'}
                      </Text>
                    </View>
                  ) : null}
                  <Ionicons
                    name="ios-arrow-forward"
                    color="rgba(0,0,0,0.1)"
                    size={24}
                  />
                </View>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity
                style={styles.row}
                onPress={user.facebookID ? disconnectFB : connectWithFacebook}
              >
                <View style={styles.info}>
                  <View
                    style={[styles.iconWrap, { backgroundColor: '#3B5998' }]}
                  >
                    <Ionicons color="#fff" name="logo-facebook" size={28} />
                  </View>
                  <Text style={styles.rowText}>
                    {user.facebookID
                      ? 'Disconnect from Facebook'
                      : 'Connect to Facebook'}
                  </Text>
                </View>
                <Ionicons
                  name="ios-arrow-forward"
                  color="rgba(0,0,0,0.1)"
                  size={24}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.group}>
              <TouchableOpacity style={styles.row} onPress={handleSuggest}>
                <View style={styles.info}>
                  <View style={styles.iconWrap}>
                    <FontAwesome5
                      color="#fff"
                      size={24}
                      name="lightbulb"
                      solid
                    />
                  </View>
                  <Text style={styles.rowText}>Suggest a word/category</Text>
                </View>
                <View style={styles.iconsRight}>
                  <Crown height={18} width={18} style={styles.crown} />
                  <Ionicons
                    name="ios-arrow-forward"
                    color="rgba(0,0,0,0.1)"
                    size={24}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.group}>
              <TouchableOpacity style={styles.row} onPress={showFeedback}>
                <View style={styles.info}>
                  <View style={styles.iconWrap}>
                    <Ionicons color="#fff" name="ios-chatbubbles" size={28} />
                  </View>
                  <Text style={styles.rowText}>Tell us what you think</Text>
                </View>
                <Ionicons
                  name="ios-arrow-forward"
                  color="rgba(0,0,0,0.1)"
                  size={24}
                />
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.row} onPress={sendEmail}>
                <View style={styles.info}>
                  <View style={[styles.iconWrap, styles.secondary]}>
                    <Ionicons
                      color="#fff"
                      name={`${PRE_ICON}-mail`}
                      size={28}
                    />
                  </View>
                  <Text style={styles.rowText}>Send us an Email</Text>
                </View>
                <Ionicons
                  name="ios-arrow-forward"
                  color="rgba(0,0,0,0.1)"
                  size={24}
                />
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.row} onPress={sendSMS}>
                <View style={styles.info}>
                  <View style={[styles.iconWrap, styles.secondary]}>
                    <Ionicons color="#fff" name="ios-chatboxes" size={28} />
                  </View>
                  <Text style={styles.rowText}>Send us a Text</Text>
                </View>
                <Ionicons
                  name="ios-arrow-forward"
                  color="rgba(0,0,0,0.1)"
                  size={24}
                />
              </TouchableOpacity>
            </View>
            <View style={[styles.group, { marginBottom: 0 }]}>
              <TouchableOpacity style={styles.row} onPress={logout}>
                <View style={styles.info}>
                  <View
                    style={[styles.iconWrap, { backgroundColor: '#FF5252' }]}
                  >
                    <Ionicons
                      color="#fff"
                      name={`${PRE_ICON}-log-out`}
                      size={28}
                    />
                  </View>
                  <Text style={styles.rowText}>Logout</Text>
                </View>
                <Ionicons
                  name="ios-arrow-forward"
                  color="rgba(0,0,0,0.1)"
                  size={24}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FCFCFE',
    overflow: 'hidden',
    flex: 1,
    paddingTop: 0,
    paddingBottom: 24
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  imageWrapper: {
    alignItems: 'center',
    borderRadius: 108 / 2,
    elevation: 8,
    height: 108,
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: 108
  },
  profilePic: {
    borderRadius: 108 / 2,
    height: 108,
    width: 108
  },
  username: {
    fontFamily: 'sf-bold',
    fontSize: 18,
    marginVertical: 12
  },
  profileButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  pbText: {
    color: '#7c4dff',
    fontFamily: 'sf-bold',
    fontSize: 18
  },
  group: {
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.04)',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    marginBottom: 36,
    width: '100%'
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  info: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#8E8E93',
    height: 36,
    justifyContent: 'center',
    marginRight: 12,
    width: 36
  },
  rowText: {
    fontFamily: 'sf-medium',
    fontSize: 16
  },
  divider: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    height: 1,
    marginLeft: 60,
    width: Layout.window.width - 60
  },
  secondary: {
    backgroundColor: '#7c4dff'
  },
  goBack: {
    height: 30,
    left: 24,
    position: 'absolute',
    top: 24,
    width: 30
  },
  progressOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 108 / 2,
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 2
  },
  progress: {
    color: '#fff',
    fontFamily: 'sf-medium',
    fontSize: 18
  },
  icons: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  badge: {
    alignItems: 'center',
    backgroundColor: '#FF5252',
    borderRadius: 18 / 2,
    height: 18,
    justifyContent: 'center',
    marginRight: 12,
    width: 18
  },
  badgeText: {
    color: '#fff',
    fontFamily: 'sf-bold',
    fontSize: 10
  },
  iconsRight: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  crown: {
    marginRight: 12,
    opacity: 0.4
  },
  editImage: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 36 / 2,
    bottom: -6,
    elevation: 4,
    height: 36,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: 36
  }
});

SettingsScreen.propTypes = {
  navigation: object.isRequired,
  uploadFile: func.isRequired,
  resetReduxState: func.isRequired,
  displayBadge: func.isRequired,
  showFeedback: func.isRequired,
  showSuggest: func.isRequired,
  showProModal: func.isRequired,
  uploading: bool,
  progress: number
};

SettingsScreen.defaultProps = {
  uploading: false,
  progress: 0
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
