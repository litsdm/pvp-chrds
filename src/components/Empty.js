import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { func, string } from 'prop-types';

const Empty = ({ title, description, action, actionTitle }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.description}>{description}</Text>
    {action ? (
      <TouchableOpacity style={styles.button} onPress={action}>
        <Text style={styles.buttonText}>{actionTitle}</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 48,
    padding: 12
  },
  title: {
    fontFamily: 'sf-bold',
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center'
  },
  description: {
    fontFamily: 'sf-light',
    fontSize: 18,
    opacity: 0.6,
    marginBottom: 12,
    textAlign: 'center'
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#7c4dff',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'sf-bold',
    fontSize: 18
  }
});

Empty.propTypes = {
  title: string.isRequired,
  description: string.isRequired,
  action: func,
  actionTitle: string
};

Empty.defaultProps = {
  action: null,
  actionTitle: null
};

export default Empty;
