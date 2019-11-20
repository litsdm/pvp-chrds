import { InMemoryCache } from 'apollo-cache-inmemory';

const cache = new InMemoryCache();

cache.writeData({
  data: {
    displayPlay: false
  }
});

export default cache;
