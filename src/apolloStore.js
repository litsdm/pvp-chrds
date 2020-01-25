import { ApolloClient } from 'apollo-client';
import { split, from } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { onError } from 'apollo-link-error';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';

import store from './reduxStore';
import { getApiUrl } from './helpers/apiCaller';
import { toggleBadge, toggleNetworkModal } from './actions/popup';

console.log(getApiUrl());
const httpLink = new HttpLink({
  uri: getApiUrl()
});

const wsLink = new WebSocketLink({
  uri: getApiUrl(true),
  options: {
    reconnect: true
  }
});

const links = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink
);

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message }) =>
      store.dispatch(toggleBadge(true, message, 'error'))
    );

  if (networkError) {
    store.dispatch(toggleBadge(true, 'Network Error', 'error'));
    store.dispatch(toggleNetworkModal(true));
  }
});

const link = from([errorLink, links]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

export default client;
