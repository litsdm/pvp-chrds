import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Share from 'react-native-share';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { bool, func, node, object, string } from 'prop-types';

import { useAnimation } from '../helpers/hooks';
import useDownload from '../helpers/downloadManager';

import Popup from './Popup';
import DownloadProgress from './DownloadProgress';

const SocialButton = ({
  title,
  backgroundColor,
  iconName,
  iconColor,
  icon,
  onPress,
  igBackground
}) => (
  <TouchableOpacity style={styles.socialButton} onPress={onPress}>
    <View style={[styles.socialIconWrapper, { backgroundColor }]}>
      {igBackground ? (
        <LinearGradient
          style={styles.background}
          colors={['#405DE6', '#C13584', '#F56040', '#FFDC80']}
        />
      ) : null}
      {icon || (
        <FontAwesome5 name={iconName} color={iconColor} size={30} solid />
      )}
    </View>
    <Text style={styles.socialText}>{title}</Text>
  </TouchableOpacity>
);

const SharePopup = ({ close, baseOptions, downloadFirst }) => {
  const [download, { progress, inProgress }] = useDownload();
  const { animationValue, animateTo } = useAnimation({
    autoPlay: true,
    type: 'spring'
  });

  const processVideo = async fileURL => {
    const url = downloadFirst ? await download(fileURL) : fileURL;

    // Add watermark to video here

    return url;
  };

  const shareSingle = social => async () => {
    try {
      const processedURL = await processVideo(baseOptions.url);

      const options = {
        ...baseOptions,
        social,
        whatsAppNumber: '9199999999',
        url: processedURL
      };
      Share.shareSingle(options);
      handleClose();
    } catch (exception) {
      console.warn(exception.message);
    }
  };

  const handleMore = async () => {
    try {
      const processedURL = await processVideo(baseOptions.url);
      Share.open({ ...baseOptions, url: processedURL });
      handleClose();
    } catch (exception) {
      console.warn(exception);
    }
  };

  const handleClose = () => {
    animateTo(0);
    setTimeout(() => close(), 200);
  };

  return (
    <>
      <Popup
        close={close}
        animation={{ animationValue, animateTo }}
        showsDragIndicator={false}
        preventBackHandler={inProgress}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Share to</Text>
          </View>
          <View style={styles.divider} />
          <TouchableWithoutFeedback>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.buttonContainer}>
                <SocialButton
                  title="WhatsApp"
                  backgroundColor="#25D366"
                  iconName="whatsapp"
                  onPress={shareSingle(Share.Social.WHATSAPP)}
                />
                <SocialButton
                  title="Facebook"
                  backgroundColor="#3b5998"
                  iconName="facebook-f"
                  onPress={shareSingle(Share.Social.FACEBOOK)}
                />
                <SocialButton
                  title="Instagram"
                  backgroundColor="#C13584"
                  iconName="instagram"
                  onPress={shareSingle(Share.Social.INSTAGRAM)}
                  igBackground
                />
                {Platform.OS === 'ios' ? (
                  <SocialButton
                    title="Stories"
                    backgroundColor="#C13584"
                    iconName="instagram"
                    onPress={shareSingle(Share.Social.INSTAGRAM_STORIES)}
                    igBackground
                  />
                ) : null}
                <SocialButton
                  title="Email"
                  backgroundColor="#03A9F4"
                  iconName="envelope"
                  onPress={shareSingle(Share.Social.EMAIL)}
                />
                <SocialButton
                  title="More"
                  backgroundColor="#efefef"
                  iconName="ellipsis-h"
                  iconColor="#000"
                  onPress={handleMore}
                />
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.cancel} onPress={handleClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Popup>
      {inProgress ? <DownloadProgress progress={progress} /> : null}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    height: 52,
    justifyContent: 'center'
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
  buttonContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 12
  },
  socialButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12
  },
  socialIconWrapper: {
    alignItems: 'center',
    borderRadius: 54 / 2,
    height: 54,
    justifyContent: 'center',
    width: 54
  },
  socialText: {
    fontFamily: 'sf-regular',
    opacity: 0.4
  },
  cancel: {
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
    marginTop: 18,
    width: '100%'
  },
  cancelText: {
    fontFamily: 'sf-medium',
    fontSize: 18,
    opacity: 0.4
  },
  background: {
    borderRadius: 54 / 2,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  }
});

SocialButton.propTypes = {
  title: string.isRequired,
  backgroundColor: string,
  iconName: string,
  iconColor: string,
  icon: node,
  onPress: func.isRequired,
  igBackground: bool
};

SocialButton.defaultProps = {
  iconName: '',
  iconColor: '#fff',
  icon: null,
  backgroundColor: '#efefef',
  igBackground: false
};

SharePopup.propTypes = {
  close: func.isRequired,
  baseOptions: object.isRequired,
  downloadFirst: bool
};

SharePopup.defaultProps = {
  downloadFirst: false
};

export default SharePopup;
