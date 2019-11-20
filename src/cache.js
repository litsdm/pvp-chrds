import { InMemoryCache } from 'apollo-cache-inmemory';

const cache = new InMemoryCache();

cache.writeData({
  data: {
    displayPlay: false,
    playCategory: null,
    displayCategory: false,
    selectedCategory: null
  }
});

export default cache;
