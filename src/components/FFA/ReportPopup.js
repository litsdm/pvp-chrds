import React, { useEffect, useState, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { func, string } from 'prop-types';

import Popup from '../Popup';

import Layout from '../../constants/Layout';

const reasons = [
  'Pornography and nudity',
  'Violent and graphic content',
  'Animal cruelty',
  'Hate speech',
  'Harassment or bullying',
  'Suicide or self-harm',
  'Dangerous organizations and individuals',
  'Illegal activities and regulated goods',
  'Minor Safety',
  'Intellectual property infringement',
  'Spam',
  'Other'
];

const SubmitPage = ({ submit, reason, message, setMessage }) => (
  <View style={styles.submit}>
    <Text style={styles.selectedReason}>Report reason: {reason}</Text>
    <View style={styles.divider} />
    <View>
      <View style={styles.labelWrapper}>
        <Text style={styles.label}>Report Description (Optional)</Text>
        <Text style={styles.chars}>{message.length}/200</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Please provide as much detail as possible"
        onChangeText={setMessage}
        textAlignVertical="top"
        maxLength={200}
        multiline
      />
    </View>
    <View style={styles.divider} />
    <TouchableOpacity style={styles.button} onPress={submit}>
      <Text style={styles.buttonText}>Submit</Text>
    </TouchableOpacity>
  </View>
);

const SelectReasonPage = ({ selectReason }) => (
  <View style={styles.reasonContainer}>
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.reasonTitle}>Please select a reason</Text>
      {reasons.map(reason => (
        <TouchableOpacity
          key={reason}
          style={styles.row}
          onPress={selectReason(reason)}
        >
          <Text style={styles.reason}>{reason}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

const ReportPopup = ({ close, submit }) => {
  const [page, setPage] = useState(0);
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
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

  const selectReason = newReason => () => {
    setReason(newReason);
    setPage(1);
  };

  const back = () => {
    setReason('');
    setPage(0);
  };

  const handleSubmit = () => {
    submit(reason, message);
  };

  return (
    <Popup close={close} showsDragIndicator={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={page === 0 ? close : back}
          >
            <Ionicons
              name={page === 0 ? 'md-close' : 'md-arrow-round-back'}
              size={24}
              color="#000"
            />
          </TouchableOpacity>
          <Text style={styles.title}>Report</Text>
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
          <SelectReasonPage selectReason={selectReason} />
          <SubmitPage
            message={message}
            setMessage={setMessage}
            reason={reason}
            submit={handleSubmit}
          />
        </ScrollView>
      </View>
    </Popup>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: (Layout.window.height * 3) / 4
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
  reasonTitle: {
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
  reason: {
    fontFamily: 'sf-regular',
    fontSize: 14
  },
  divider: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    height: 1,
    width: '100%'
  },
  reasonContainer: {
    flex: 1,
    paddingHorizontal: 12,
    width: Layout.window.width
  },
  submit: {
    paddingHorizontal: 12,
    width: Layout.window.width
  },
  selectedReason: {
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
  reason: string.isRequired,
  message: string.isRequired,
  setMessage: func.isRequired
};

SelectReasonPage.propTypes = {
  selectReason: func.isRequired
};

ReportPopup.propTypes = {
  close: func.isRequired,
  submit: func.isRequired
};

export default ReportPopup;
