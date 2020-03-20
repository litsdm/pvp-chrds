import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { func, string } from 'prop-types';

import UPDATE_USER from '../graphql/mutations/updateUser';

import Popup from './Popup';

import Layout from '../constants/Layout';

const TermsPopup = ({ close, userID, onAccept }) => {
  const [updateUser] = useMutation(UPDATE_USER);

  const uri = 'https://cdiezmoran.github.io/chrds-eula/';

  const handleAccept = async () => {
    const properties = JSON.stringify({ acceptedEula: true });
    await updateUser({ variables: { id: userID, properties } });
    if (onAccept) onAccept();
    close();
  };

  return (
    <Popup close={close} showsDragIndicator={false}>
      <View style={styles.container}>
        <View>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={close}>
              <Ionicons name="md-close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.title}>Terms & Conditions</Text>
          </View>
          <View style={styles.divider} />
        </View>
        <TouchableWithoutFeedback>
          <WebView source={{ uri }} />
        </TouchableWithoutFeedback>
        <View>
          <View style={styles.divider} />
          <Text style={styles.disclaimer}>
            If you decline you will not be able to upload any content.
          </Text>
          <View style={styles.buttonsWrapper}>
            <TouchableOpacity style={styles.secondary} onPress={close}>
              <Text style={styles.secondaryText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primary} onPress={handleAccept}>
              <Text style={styles.primaryText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Popup>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Layout.window.height - 52,
    justifyContent: 'space-between'
  },
  header: {
    alignItems: 'center',
    height: 52,
    justifyContent: 'center'
  },
  closeButton: {
    height: 24,
    left: 12,
    position: 'absolute',
    width: 24
  },
  title: {
    fontFamily: 'sf-bold',
    fontSize: 18
  },
  divider: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    height: 1,
    width: '100%'
  },
  disclaimer: {
    alignSelf: 'center',
    fontFamily: 'sf-regular',
    fontSize: 12,
    opacity: 0.4,
    marginTop: 12,
    textAlign: 'center',
    width: '70%'
  },
  buttonsWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingHorizontal: 12,
    marginBottom: Platform.OS !== 'ios' ? 36 : 12
  },
  secondary: {
    alignItems: 'center',
    height: 42,
    justifyContent: 'center',
    width: '44%'
  },
  secondaryText: {
    fontFamily: 'sf-medium',
    opacity: 0.7
  },
  primary: {
    alignItems: 'center',
    backgroundColor: '#7c4dff',
    borderRadius: 8,
    height: 42,
    justifyContent: 'center',
    width: '44%'
  },
  primaryText: {
    color: '#fff',
    fontFamily: 'sf-medium'
  }
});

TermsPopup.propTypes = {
  close: func.isRequired,
  userID: string.isRequired,
  onAccept: func
};

TermsPopup.defaultProps = {
  onAccept: null
};

export default TermsPopup;
