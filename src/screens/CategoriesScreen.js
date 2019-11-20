import React from 'react';
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

import CategoryColumn from '../components/CategoryColumn';
import Loader from '../components/Loader';

import Layout from '../constants/Layout';

const CategoriesScreen = () => {
  const { loading, data } = useQuery(GET_CATEGORIES);

  const categories = data ? data.categories : [];

  const renderCategories = () =>
    categories.map(({ _id, name, description, image, color }) => (
      <CategoryColumn
        key={_id}
        name={name}
        description={description}
        image={image}
        color={color}
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
            {/* featured image here */}
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
    borderRadius: 6,
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 12,
    maxWidth: '45%'
  },
  buttonText: {
    color: '#7c4dff',
    fontFamily: 'sf-bold',
    fontSize: 16
  },
  title: {
    fontFamily: 'sf-bold',
    fontSize: 24,
    marginBottom: 12,
    marginLeft: 12
  }
});

export default CategoriesScreen;
