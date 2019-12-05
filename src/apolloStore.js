import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: 'http://192.168.15.6:8080'
});

export default client;
