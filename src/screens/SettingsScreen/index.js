import React from 'react';
import {
  AsyncStorage,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useApolloClient } from '@apollo/react-hooks';
import { Ionicons } from '@expo/vector-icons';
import * as StoreReview from 'expo-store-review';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { object } from 'prop-types';

import Layout from '../../constants/Layout';

const PRE_ICON = Platform.OS === 'ios' ? 'ios' : 'md';

const SettingsScreen = ({ navigation }) => {
  const client = useApolloClient();

  const goBack = () => navigation.navigate('Home');

  const rateApp = () => Linking.openURL(StoreReview.storeUrl());

  const sendSMS = () => Linking.openURL('sms:+5215534889576');

  const sendEmail = () => Linking.openURL('mailto:cdiezmoran@gmail.com');

  const goToGeneral = () => navigation.navigate('General');

  const logout = async () => {
    await AsyncStorage.removeItem('CHRDS_TOKEN');
    client.cache.reset();
    navigation.navigate('Auth');
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.goBack} onPress={goBack}>
            <Ionicons name="ios-arrow-round-back" color="#000" size={30} />
          </TouchableOpacity>
          <View style={styles.imageWrapper}>
            <Image
              style={styles.profilePic}
              source={{ uri: 'https://thispersondoesnotexist.com/image' }}
            />
          </View>
          <Text style={styles.username}>@username.1234</Text>
          <TouchableOpacity style={styles.profileButton}>
            <Text style={styles.pbText}>View Profile</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <View style={styles.group}>
            <TouchableOpacity style={styles.row} onPress={rateApp}>
              <View style={styles.info}>
                <View style={[styles.iconWrap, { backgroundColor: '#FFC107' }]}>
                  <Ionicons color="#fff" name={`${PRE_ICON}-star`} size={28} />
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
            <TouchableOpacity style={styles.row}>
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
            <TouchableOpacity style={styles.row}>
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
              <Ionicons
                name="ios-arrow-forward"
                color="rgba(0,0,0,0.1)"
                size={24}
              />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.row}>
              <View style={styles.info}>
                <View style={[styles.iconWrap, { backgroundColor: '#3B5998' }]}>
                  <Ionicons color="#fff" name="logo-facebook" size={28} />
                </View>
                <Text style={styles.rowText}>Connect to Facebook</Text>
              </View>
              <Ionicons
                name="ios-arrow-forward"
                color="rgba(0,0,0,0.1)"
                size={24}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.group}>
            <TouchableOpacity style={styles.row}>
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
                  <Ionicons color="#fff" name={`${PRE_ICON}-mail`} size={28} />
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
                <View style={[styles.iconWrap, { backgroundColor: '#FF5252' }]}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FCFCFE',
    overflow: 'hidden',
    flex: 1,
    paddingTop: getStatusBarHeight(),
    paddingBottom: 24
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  imageWrapper: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 108 / 2,
    elevation: 4,
    height: 108,
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: 108
  },
  profilePic: {
    borderRadius: 96 / 2,
    height: 96,
    width: 96
  },
  username: {
    fontFamily: 'sf-bold',
    fontSize: 18,
    marginVertical: 12
  },
  profileButton: {
    alignItems: 'center',
    paddingVertical: 6,
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
  }
});

SettingsScreen.propTypes = {
  navigation: object.isRequired
};

export default SettingsScreen;
