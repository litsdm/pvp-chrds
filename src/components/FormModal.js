import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { arrayOf, func, string } from 'prop-types';

import Modal from './Modal';
import Input from './Auth/Input';

const FormModal = ({ close, title, labels, values, setState, submit }) => {
  const handleTextChange = name => value => setState(toCamelCase(name), value);

  const toCamelCase = originalString => {
    const words = originalString.split(' ');
    let result = '';

    words.forEach((word, index) => {
      let temp = word.toLowerCase();
      if (index !== 0) temp = temp.substr(0, 1).toUpperCase() + temp.substr(1);
      result += temp;
    });

    return result;
  };

  const renderInputs = () =>
    labels.map((label, index) => (
      <Input
        key={label}
        label={label}
        value={values[index]}
        onChangeText={handleTextChange(label)}
        secureTextEntry={label.toLowerCase().includes('password')}
      />
    ));

  return (
    <Modal close={close}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        {renderInputs()}
        <TouchableOpacity style={styles.button} onPress={submit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12
  },
  title: {
    fontFamily: 'sf-bold',
    fontSize: 18,
    marginBottom: 12
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#7c4dff',
    borderRadius: 8,
    justifyContent: 'center',
    paddingVertical: 6,
    width: '50%'
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'sf-bold',
    fontSize: 18
  }
});

FormModal.propTypes = {
  close: func.isRequired,
  title: string.isRequired,
  labels: arrayOf(string).isRequired,
  values: arrayOf(string).isRequired,
  setState: func.isRequired,
  submit: func.isRequired
};

export default FormModal;
