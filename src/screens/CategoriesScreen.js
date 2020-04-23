import React, { useEffect, useState, useRef, createRef } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { bool, func, object } from 'prop-types';

import GET_CATEGORIES from '../graphql/queries/getCategories';
import GET_USER from '../graphql/queries/getCategoryUser';

import analytics from '../helpers/analyticsClient';
import {
  toggleCategory,
  togglePlay,
  toggleCategoryPurchase,
  togglePurchasePopup
} from '../actions/popup';

import CategoryColumn from '../components/CategoryColumn';
import Loader from '../components/Loader';

import Layout from '../constants/Layout';

const mapDispatchToProps = dispatch => ({
  showCategory: data => dispatch(toggleCategory(true, data)),
  showPlay: data => dispatch(togglePlay(true, data)),
  openPurchase: data => dispatch(toggleCategoryPurchase(true, data)),
  openShop: () => dispatch(togglePurchasePopup(true))
});

const mapStateToProps = ({ popup: { displayCategory, selectedCategory } }) => ({
  displayCategory,
  popupSelectedCategory: selectedCategory
});

const CategoriesScreen = ({
  displayCategory,
  popupSelectedCategory,
  showCategory,
  showPlay,
  openPurchase,
  openShop
}) => {
  const { loading, data, refetch } = useQuery(GET_CATEGORIES);
  const [getUser, { data: userData }] = useLazyQuery(GET_USER);
  const [categoriesHash, setCategoriesHash] = useState({});
  const [featuredCategory, setFeaturedCategory] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [displayingNavbar, setDisplayingNavbar] = useState(false);
  const logoRefs = useRef([...Array(15)].map(() => createRef()));

  const categories = data ? data.categories : [];
  const user = userData ? userData.user : {};

  useEffect(() => {
    fetchUser();
    analytics.setCurrentScreen({ screenName: 'Categories' });
  }, []);

  useEffect(() => {
    if (userData && userData.user) {
      const hash = {};
      user.categories.forEach(category => {
        hash[category] = true;
      });

      setCategoriesHash(hash);
    }
  }, [userData]);

  useEffect(() => {
    if (data && data.categories) getFeaturedCategory();
  }, [data]);

  const getFeaturedCategory = () => {
    const featured = categories.find(category => category.isFeatured);
    setFeaturedCategory(featured || null);
  };

  const fetchUser = async () => {
    const { _id } = jwtDecode(await AsyncStorage.getItem('CHRDS_TOKEN'));
    getUser({ variables: { _id } });
  };

  const showPopup = index => () => {
    const selectedCategory = categories[index];
    const hasCategory =
      categoriesHash[selectedCategory._id] !== undefined || user.isPro;
    logoRefs.current[index].current.measureInWindow((x, y) => {
      const transitionPosition = { __typename: 'Position', x, y };
      showCategory({
        category: selectedCategory,
        transitionPosition,
        hasCategory,
        user
      });
    });
  };

  const verticalStyles =
    featuredCategory === null
      ? {
          marginBottom: 12
        }
      : null;

  const openPlay = _id => () => showPlay({ playCategory: _id });
  const handleOpenPurchase = category => () => openPurchase({ category, user });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleScroll = ({
    nativeEvent: {
      contentOffset: { y }
    }
  }) => {
    if (y >= 1 && !displayingNavbar) {
      setDisplayingNavbar(true);
    } else if (y < 1 && displayingNavbar) {
      setDisplayingNavbar(false);
    }
  };

  const renderCategories = () =>
    categories.map(
      ({ _id, name, description, image, color, price, proOnly }, index) => (
        <CategoryColumn
          key={_id}
          name={name}
          description={description}
          image={image}
          color={color}
          onPressInner={openPlay(_id)}
          onPress={showPopup(index)}
          logoRef={logoRefs ? logoRefs.current[index] : null}
          hideLogo={displayCategory && popupSelectedCategory._id === _id}
          parentBackgroundColor="#FCFCFE"
          containerStyles={verticalStyles}
          hasCategory={categoriesHash[_id] !== undefined || user.isPro}
          price={price}
          openPurchase={
            proOnly ? openShop : handleOpenPurchase({ _id, name, image, price })
          }
          proOnly={proOnly}
        />
      )
    );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Loader />
      ) : (
        <>
          {featuredCategory !== null ? (
            <View style={styles.featured}>
              {featuredCategory.featureImage ? (
                <Image
                  source={{ uri: featuredCategory.featureImage }}
                  style={styles.bgImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.bgPlacholder} />
              )}
              <Text style={styles.name}>{featuredCategory.name}</Text>
              <Text style={styles.description}>
                {featuredCategory.description}
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={openPlay(featuredCategory._id)}
              >
                <Text style={styles.buttonText}>Play</Text>
              </TouchableOpacity>
            </View>
          ) : null}
          <View style={{ paddingBottom: 52 }}>
            {!featuredCategory ? (
              <View
                style={[
                  styles.nav,
                  { backgroundColor: displayingNavbar ? '#fff' : '#FCFCFE' }
                ]}
              >
                <Text style={styles.title}>Let&#39;s Play</Text>
              </View>
            ) : (
              <Text style={styles.featureTitle}>Let&#39;s Play</Text>
            )}
            <ScrollView
              horizontal={featuredCategory !== null}
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                />
              }
            >
              {featuredCategory ? (
                renderCategories()
              ) : (
                <View style={styles.vertical}>{renderCategories()}</View>
              )}
            </ScrollView>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FCFCFE',
    justifyContent: 'space-between',
    overflow: 'hidden',
    flex: 1,
    paddingTop: 0
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
  bgImage: {
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
    maxWidth: '70%'
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
  nav: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    height: 52,
    paddingLeft: 12
  },
  title: {
    fontFamily: 'sf-bold',
    fontSize: 24
  },
  featureTitle: {
    fontFamily: 'sf-bold',
    fontSize: 24,
    marginBottom: 12,
    marginLeft: 12,
    marginTop: 12
  },
  vertical: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
});

CategoriesScreen.propTypes = {
  displayCategory: bool.isRequired,
  popupSelectedCategory: object,
  showCategory: func.isRequired,
  showPlay: func.isRequired,
  openPurchase: func.isRequired,
  openShop: func.isRequired
};

CategoriesScreen.defaultProps = {
  popupSelectedCategory: {}
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesScreen);
