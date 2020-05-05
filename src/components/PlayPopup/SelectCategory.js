import React from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { arrayOf, bool, func, number, object, shape, string } from 'prop-types';

import CategoryColumn from '../CategoryColumn';

import Layout from '../../constants/Layout';

const SelectCategory = ({
  categories,
  selectCategory,
  categoryHash,
  isPro,
  openShop,
  openPurchase
}) => {
  const renderCategories = () =>
    categories.map(
      ({ _id, name, description, image, color, price, proOnly }) => (
        <View key={_id} style={{ marginBottom: 24 }}>
          <CategoryColumn
            key={_id}
            name={name}
            description={description}
            image={image}
            color={color}
            onPress={selectCategory(_id)}
            selecting
            hasCategory={categoryHash[_id] !== undefined || isPro}
            price={price}
            openPurchase={
              proOnly ? openShop : openPurchase({ _id, name, image, price })
            }
            proOnly={proOnly}
          />
        </View>
      )
    );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.title}>Please select a category</Text>
        <View style={{ marginBottom: 24 }}>
          <CategoryColumn
            name="Random"
            description="Selects a random category"
            onPress={selectCategory('-1')}
            color="#03A9F4"
            selecting
          />
        </View>
        {renderCategories()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
    width: Layout.window.width
  },
  contentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: Layout.window.width
  },
  title: {
    color: 'rgba(0,0,0,0.6)',
    fontFamily: 'sf-regular',
    fontSize: 14,
    marginVertical: 12,
    marginLeft: 18,
    textTransform: 'uppercase'
  }
});

SelectCategory.propTypes = {
  selectCategory: func.isRequired,
  openPurchase: func.isRequired,
  categories: arrayOf(
    shape({
      _id: string,
      name: string,
      description: string,
      image: string,
      color: string,
      price: number
    })
  ),
  categoryHash: object,
  isPro: bool.isRequired,
  openShop: func.isRequired
};

SelectCategory.defaultProps = {
  categories: [],
  categoryHash: {}
};

export default SelectCategory;
