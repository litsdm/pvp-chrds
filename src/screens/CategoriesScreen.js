import React, { useRef, createRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import GET_CATEGORIES from '../graphql/queries/getCategories';
import GET_POPUP_DATA from '../graphql/queries/getPopupData';

import CategoryColumn from '../components/CategoryColumn';
import Loader from '../components/Loader';

import Layout from '../constants/Layout';

const CategoriesScreen = () => {
  const { loading, data, client } = useQuery(GET_CATEGORIES);
  const {
    data: { displayCategory, selectedCategory: popupSelectedCategory }
  } = useQuery(GET_POPUP_DATA);
  const logoRefs = useRef([...Array(3)].map(() => createRef()));

  const categories = data ? data.categories : [];

  const showPopup = index => () => {
    const selectedCategory = categories[index];
    logoRefs.current[index].current.measureInWindow((x, y) => {
      const transitionPosition = { __typename: 'Position', x, y };
      client.writeData({
        data: { displayCategory: true, selectedCategory, transitionPosition }
      });
    });
  };

  const openPlay = _id => () =>
    client.writeData({ data: { displayPlay: true, playCategory: _id } });

  const renderCategories = () =>
    categories.map(({ _id, name, description, image, color }, index) => (
      <CategoryColumn
        key={_id}
        name={name}
        description={description}
        image={image}
        color={color}
        onPressInner={openPlay(_id)}
        onPress={showPopup(index)}
        logoRef={logoRefs.current[index]}
        hideLogo={displayCategory && popupSelectedCategory._id === _id}
        parentBackgroundColor="#FCFCFE"
      />
    ));

  return (
    <View style={styles.container}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <View style={styles.featured}>
            <View style={styles.bgPlacholder} />
            <Text style={styles.name}>TV Series Characters</Text>
            <Text style={styles.description}>Featured description</Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Play</Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.title}>Let&#39;s Play</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {renderCategories()}
            </ScrollView>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FCFCFE',
    justifyContent: 'space-between',
    overflow: 'hidden',
    flex: 1,
    paddingTop: getStatusBarHeight(),
    paddingBottom: 24
  },
  featured: {
    height: Layout.window.height / 2 - 12,
    justifyContent: 'flex-end',
    paddingLeft: 12,
    width: '100%'
  },
  bgPlacholder: {
    backgroundColor: '#aaa',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  },
  name: {
    color: '#fff',
    fontFamily: 'sf-bold',
    fontSize: 20,
    marginBottom: 12,
    maxWidth: '50%'
  },
  description: {
    color: '#fff',
    fontFamily: 'sf-light',
    fontSize: 16,
    marginBottom: 12,
    maxWidth: '50%'
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 12,
    maxWidth: '45%'
  },
  buttonText: {
    color: '#7c4dff',
    fontFamily: 'sf-bold',
    fontSize: 18
  },
  title: {
    fontFamily: 'sf-bold',
    fontSize: 24,
    marginBottom: 12,
    marginLeft: 12
  }
});

export default CategoriesScreen;
