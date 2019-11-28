import gql from 'graphql-tag';
import { InMemoryCache } from 'apollo-cache-inmemory';

const cache = new InMemoryCache();

cache.writeData({
  data: {
    displayPlay: false,
    playCategory: null,
    playFriend: null,
    displayCategory: false,
    selectedCategory: null,
    transitionPosition: null,
    displayAdd: false
  }
});

export default cache;

export const typeDefs = gql`
  type Position {
    x: Float!
    y: Float!
  }
`;
