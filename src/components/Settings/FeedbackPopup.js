import React, { useEffect, useState, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import { Ionicons } from '@expo/vector-icons';
import { func, string } from 'prop-types';

import CREATE_FEEDBACK from '../../graphql/mutations/createFeedback';

import { useAnimation, useUserID } from '../../helpers/hooks';
import Layout from '../../constants/Layout';

import Popup from '../Popup';

const types = ['Feedback', 'Bug Report', 'Other'];

const SubmitPage = ({ submit, type, message, setMessage }) => (
  <View style={styles.submit}>
    <Text style={styles.selectedType}>Message type: {type}</Text>
    <View style={styles.divider} />
    <View>
      <View style={styles.labelWrapper}>
        <Text style={styles.label}>Message</Text>
        <Text style={styles.chars}>{message.length}/5000</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Please provide as much detail as possible"
        onChangeText={setMessage}
        textAlignVertical="top"
        maxLength={5000}
        multiline
      />
    </View>
    <View style={styles.divider} />
    <TouchableOpacity style={styles.button} onPress={submit}>
      <Text style={styles.buttonText}>Submit</Text>
    </TouchableOpacity>
  </View>
);

const SelectTypePage = ({ selectType }) => (
  <View style={styles.typeContainer}>
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.typeTitle}>Please select a type</Text>
      {types.map(type => (
        <TouchableOpacity
          key={type}
          style={styles.row}
          onPress={selectType(type)}
        >
          <Text style={styles.type}>{type}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

const FeedbackPopup = ({ close, displayBadge }) => {
  const [createFeedback] = useMutation(CREATE_FEEDBACK);
  const [page, setPage] = useState(0);
  const [type, setType] = useState('');
  const [message, setMessage] = useState('');
  const { animationValue, animateTo } = useAnimation({ type: 'spring' });
  const userID = useUserID();
  const scrollView = useRef(null);

  useEffect(() => {
    scrollPage();
  }, [page]);

  const scrollPage = () => {
    if (!scrollView.current) return;
    if (page === 0) scrollView.current.scrollTo({ x: 0, y: 0, animated: true });
    else
      scrollView.current.scrollTo({
        x: Layout.window.width * page,
        y: 0,
        animated: true
      });
  };

  const selectType = newType => () => {
    setType(newType);
    setPage(1);
  };

  const back = () => {
    setType('');
    setPage(0);
  };

  const submit = async () => {
    if (!message) {
      displayBadge('A Message is required.', 'error');
      return;
    }

    try {
      await createFeedback({ variables: { type, message, sender: userID } });
      displayBadge(
        "Thank you! Your opinion is very important to us so we'll review your message and get back to you soon",
        'success'
      );
      handleClose();
    } catch (exception) {
      displayBadge(exception.message.slice(14), 'error');
    }
  };

  const handleClose = () => {
    animateTo(0);
    setTimeout(() => close(), 200);
  };

  return (
    <Popup
      close={close}
      showsDragIndicator={false}
      animation={{ animationValue, animateTo }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={page === 0 ? handleClose : back}
          >
            <Ionicons
              name={page === 0 ? 'md-close' : 'md-arrow-round-back'}
              size={24}
              color="#000"
            />
          </TouchableOpacity>
          <Text style={styles.title}>Tell us what you think</Text>
        </View>
        <View style={styles.divider} />
        <ScrollView
          ref={scrollView}
          horizontal
          scrollEnabled={false}
          decelerationRate="fast"
          snapToAlignment="start"
          snapToInterval={Layout.window.width}
          bounces={false}
          disableIntervalMomentum
          disableScrollViewPanResponder
        >
          <SelectTypePage selectType={selectType} />
          <SubmitPage
            message={message}
            setMessage={setMessage}
            type={type}
            submit={submit}
          />
        </ScrollView>
      </View>
    </Popup>
  );
};

const styles = StyleSheet.create({
  container: {
    height: (Layout.window.height * 3) / 4
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
  typeTitle: {
    color: 'rgba(0,0,0,0.6)',
    fontFamily: 'sf-regular',
    fontSize: 14,
    marginTop: 12,
    textTransform: 'uppercase'
  },
  row: {
    paddingVertical: 12,
    width: '100%'
  },
  type: {
    fontFamily: 'sf-regular',
    fontSize: 14
  },
  divider: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    height: 1,
    width: '100%'
  },
  typeContainer: {
    flex: 1,
    paddingHorizontal: 12,
    width: Layout.window.width
  },
  submit: {
    paddingHorizontal: 12,
    width: Layout.window.width
  },
  selectedType: {
    fontFamily: 'sf-regular',
    marginVertical: 12
  },
  labelWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12
  },
  label: {
    fontFamily: 'sf-bold'
  },
  chars: {
    fontFamily: 'sf-regular',
    opacity: 0.4
  },
  input: {
    height: 120,
    width: '100%'
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#7c4dff',
    borderRadius: 8,
    height: 54,
    justifyContent: 'center',
    marginTop: 24,
    width: '100%'
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'sf-medium'
  }
});

SubmitPage.propTypes = {
  submit: func.isRequired,
  type: string.isRequired,
  message: string.isRequired,
  setMessage: func.isRequired
};

SelectTypePage.propTypes = {
  selectType: func.isRequired
};

FeedbackPopup.propTypes = {
  close: func.isRequired,
  displayBadge: func.isRequired
};

export default FeedbackPopup;
