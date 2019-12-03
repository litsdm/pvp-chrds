import gql from 'graphql-tag';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-boost';

const cache = new InMemoryCache();

const defaultData = {
  displayPlay: false,
  playCategory: null,
  playFriend: null,
  displayCategory: false,
  selectedCategory: null,
  transitionPosition: null,
  displayAdd: false
};

cache.writeData({ data: defaultData });

const typeDefs = gql`
  type Position {
    x: Float!
    y: Float!
  }
`;

const client = new ApolloClient({
  uri: 'http://192.168.15.6:8080',
  cache,
  typeDefs
});

client.onResetStore(() => cache.writeData({ data: defaultData }));

export default client;
