import React, { useRef, createRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { connect } from 'react-redux';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { bool, func, object } from 'prop-types';

import GET_CATEGORIES from '../graphql/queries/getCategories';

import { toggleCategory, togglePlay } from '../actions/popup';

import CategoryColumn from '../components/CategoryColumn';
import Loader from '../components/Loader';

import Layout from '../constants/Layout';

const mapDispatchToProps = dispatch => ({
  showCategory: data => dispatch(toggleCategory(true, data)),
  showPlay: data => dispatch(togglePlay(true, data))
});

const mapStateToProps = ({ popup: { displayCategory, selectedCategory } }) => ({
  displayCategory,
  popupSelectedCategory: selectedCategory
});

const CategoriesScreen = ({
  displayCategory,
  popupSelectedCategory,
  showCategory,
  showPlay
}) => {
  const { loading, data } = useQuery(GET_CATEGORIES);
  const logoRefs = useRef([...Array(3)].map(() => createRef()));

  const categories = data ? data.categories : [];

  const showPopup = index => () => {
    const selectedCategory = categories[index];
    logoRefs.current[index].current.measureInWindow((x, y) => {
      const transitionPosition = { __typename: 'Position', x, y };
      showCategory({ selectedCategory, transitionPosition });
    });
  };

  const openPlay = _id => () => showPlay({ playCategory: _id });

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

CategoriesScreen.propTypes = {
  displayCategory: bool.isRequired,
  popupSelectedCategory: object,
  showCategory: func.isRequired,
  showPlay: func.isRequired
};

CategoriesScreen.defaultProps = {
  popupSelectedCategory: {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoriesScreen);
