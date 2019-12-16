import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { bool, string } from 'prop-types';

const Empty = ({ searching, search }) => {
  const getTexts = () => {
    if (searching && search)
      return {
        title: 'No matches for your search.',
        description:
          "We couldn't find a friend that matches your search. You can search by username."
      };

    if (searching && !search)
      return {
        title: 'Search your already added friends.',
        description: 'You can search for friends using their username'
      };

    if (!searching)
      return {
        title: "You haven't added any friends yet.",
        description:
          'You can add friends by connecting with Facebook or clicking the Add Friend button above.'
      };
  };

  const texts = getTexts();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{texts.title}</Text>
      <Text style={styles.description}>{texts.description}</Text>
    </View>
  );
};

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
  invite: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  inviteText: {
    fontFamily: 'sf-light',
    fontSize: 14,
    opacity: 0.4,
    marginBottom: 12,
    textAlign: 'center'
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#7c4dff',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    width: '50%'
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'sf-bold',
    fontSize: 18
  }
});

Empty.propTypes = {
  searching: bool.isRequired,
  search: string.isRequired
};

export default Empty;
