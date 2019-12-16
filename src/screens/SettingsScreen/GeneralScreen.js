import React, { useEffect, useState } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { func, object } from 'prop-types';

import { toggleBadge } from '../../actions/popup';

import SettingsNavBar from '../../components/SettingsNavBar';
import FormModal from '../../components/FormModal';

import GET_USER from '../../graphql/queries/getUserFromToken';
import UPDATE_USER from '../../graphql/mutations/updateUser';
import CHANGE_PASSWORD from '../../graphql/mutations/changePassword';

const mapDispatchToProps = dispatch => ({
  displayBadge: (message, type) => dispatch(toggleBadge(true, message, type))
});

const GeneralScreen = ({ navigation, displayBadge }) => {
  const [getUser, { data, refetch: refetchUser }] = useLazyQuery(GET_USER);
  const [updateProperties, { data: updateData }] = useMutation(UPDATE_USER);
  const [changePassword] = useMutation(CHANGE_PASSWORD);
  const [displayUsenameModal, setDisplayUsernameModal] = useState(false);
  const [displayPasswordModal, setDisplayPasswordModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { _id, displayName } = data ? data.user : {};

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (data && data.user.displayName) setNewUsername(data.user.displayName);
  }, [data]);

  useEffect(() => {
    if (updateData && updateData.updateUser.token) {
      updateUserToken();
    }
  }, [updateData]);

  const fetchUser = async () => {
    const token = await AsyncStorage.getItem('CHRDS_TOKEN');
    getUser({ variables: { token } });
  };

  const updateUserToken = async () => {
    const { token } = updateData.updateUser;
    await AsyncStorage.setItem('CHRDS_TOKEN', token);
  };

  const goBack = () => navigation.goBack();
  const showUsernameModal = () => setDisplayUsernameModal(true);
  const closeUsernameModal = () => setDisplayUsernameModal(false);
  const showPasswordModal = () => setDisplayPasswordModal(true);
  const closePasswordModal = () => setDisplayPasswordModal(false);

  const receiveState = (name, value) => {
    switch (name) {
      case 'username':
        return setNewUsername(value);
      case 'currentPassword':
        return setCurrentPassword(value);
      case 'newPassword':
        return setNewPassword(value);
      default:
        break;
    }
  };

  const validateUsername = () => {
    let errorMessage = '';

    if (!newUsername) errorMessage = "Username can't be empty.";
    if (newUsername === displayName)
      errorMessage = 'You are already using that username.';

    return errorMessage;
  };

  const submitUsername = async () => {
    const errorMessage = validateUsername();

    if (errorMessage) {
      displayBadge(errorMessage, 'error');
      return;
    }

    try {
      const properties = JSON.stringify({
        username: newUsername.toLowerCase(),
        displayName: newUsername
      });

      await updateProperties({ variables: { id: _id, properties } });
      refetchUser();

      closeUsernameModal();
      displayBadge('Your username has been updated successfully!', 'success');
    } catch (exception) {
      const message = exception.message.startsWith('GraphQL error: ')
        ? exception.message.substring(14)
        : 'There was an error updating your username';
      displayBadge(message, 'error');
      console.log(exception.message);
    }
  };

  const validatePassword = () => {
    let errorMessage = '';

    if (newPassword === currentPassword)
      errorMessage = "New and current passwords can't be the same.";
    if (!currentPassword) errorMessage = 'Please enter your current password.';
    if (!newPassword) errorMessage = 'Please enter a new password.';
    if (newPassword.length < 3)
      errorMessage = 'New password must be longer than 3 characters.';

    return errorMessage;
  };

  const submitPassword = async () => {
    const errorMessage = validatePassword();

    if (errorMessage) {
      displayBadge(errorMessage, 'error');
      return;
    }

    try {
      await changePassword({
        variables: { _id, currentPassword, newPassword }
      });
      closePasswordModal();

      setCurrentPassword('');
      setNewPassword('');

      displayBadge('Your password has been updated successfully!', 'success');
    } catch (exception) {
      displayBadge('There was an error updating your password.', 'error');
    }
  };

  return (
    <View style={styles.container}>
      <SettingsNavBar goBack={goBack} title="General" />
      <View style={styles.group}>
        <Text style={styles.title}>USERNAME</Text>
        <TouchableOpacity style={styles.row} onPress={showUsernameModal}>
          <Text style={styles.rowText}>{displayName}</Text>
          <Ionicons
            name="ios-arrow-forward"
            color="rgba(0,0,0,0.1)"
            size={24}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.row} onPress={showPasswordModal}>
        <Text style={styles.rowText}>Change Password</Text>
        <Ionicons name="ios-arrow-forward" color="rgba(0,0,0,0.1)" size={24} />
      </TouchableOpacity>
      {displayPasswordModal ? (
        <FormModal
          close={closePasswordModal}
          title="Change your password"
          labels={['Current Password', 'New Password']}
          values={[currentPassword, newPassword]}
          setState={receiveState}
          submit={submitPassword}
        />
      ) : null}
      {displayUsenameModal ? (
        <FormModal
          close={closeUsernameModal}
          title="Change your username"
          labels={['Username']}
          values={[newUsername]}
          setState={receiveState}
          submit={submitUsername}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FCFCFE',
    overflow: 'hidden',
    flex: 1,
    paddingTop: getStatusBarHeight() + 78,
    paddingBottom: 24
  },
  group: {
    marginBottom: 36
  },
  row: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.04)',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 48,
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 6,
    width: '100%'
  },
  rowText: {
    fontFamily: 'sf-medium',
    fontSize: 16
  },
  title: {
    fontFamily: 'sf-light',
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 6,
    marginLeft: 12
  },
  disabled: {
    opacity: 0.4
  },
  note: {
    fontFamily: 'sf-light',
    fontSize: 10,
    opacity: 0.4,
    paddingHorizontal: 12,
    textAlign: 'center'
  }
});

GeneralScreen.propTypes = {
  navigation: object.isRequired,
  displayBadge: func.isRequired
};

export default connect(
  null,
  mapDispatchToProps
)(GeneralScreen);
