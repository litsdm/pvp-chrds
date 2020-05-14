import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { connect } from 'react-redux';
import { func, object } from 'prop-types';

import { toggleBadge } from '../../actions/popup';

import SettingsNavBar from '../../components/SettingsNavBar';
import ToggleOption from '../../components/Settings/ToggleOption';

import GET_DATA from '../../graphql/queries/getPrivacyData';
import UPDATE_USER from '../../graphql/mutations/updateUser';

import { AllowShareTypes } from '../../constants/Types';

const mapDispatchToProps = dispatch => ({
  displayBadge: (message, type) => dispatch(toggleBadge(true, message, type))
});

const PrivacyScreen = ({ navigation, displayBadge }) => {
  const userID = navigation.getParam('userID', '');
  const { data, refetch } = useQuery(GET_DATA, { variables: { _id: userID } });
  const [updateProperties] = useMutation(UPDATE_USER);
  const user = data ? data.user : {};

  const goBack = () => navigation.goBack();

  const update = async newProperties => {
    try {
      const properties = JSON.stringify(newProperties);

      await updateProperties({ variables: { id: userID, properties } });
      refetch();
    } catch (exception) {
      const message = exception.message.startsWith('GraphQL error: ')
        ? exception.message.substring(14)
        : 'There was an error updating your settings';
      displayBadge(message, 'error');
      console.log(exception.message);
    }
  };

  const updateAllowRandom = () => update({ allowRandom: !user.allowRandom });

  const updateAllowShare = () => {
    const allowShare =
      user.allowShare === AllowShareTypes.EVERYONE
        ? AllowShareTypes.SELF_ONLY
        : AllowShareTypes.EVERYONE;

    update({ allowShare });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#fff' }}
      forceInset={{ top: 'never' }}
    >
      <View style={styles.container}>
        <SettingsNavBar goBack={goBack} title="Privacy" />
        <View style={styles.group}>
          <ToggleOption
            label="Allow random opponent games"
            isActive={user.allowRandom}
            onPress={updateAllowRandom}
          />
        </View>
        <View style={styles.group}>
          <ToggleOption
            label="Allow anyone to share your FFA videos"
            isActive={user.allowShare === AllowShareTypes.EVERYONE}
            onPress={updateAllowShare}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FCFCFE',
    overflow: 'hidden',
    flex: 1,
    paddingTop: 78,
    paddingBottom: 24
  },
  group: {
    marginBottom: 36
  }
});

PrivacyScreen.propTypes = {
  navigation: object.isRequired,
  displayBadge: func.isRequired
};

export default connect(null, mapDispatchToProps)(PrivacyScreen);
