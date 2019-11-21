import gql from 'graphql-tag';

export default gql`
  {
    displayPlay
    playCategory
    displayCategory
    selectedCategory {
      _id
      name
      description
      words
      image
    }
    transitionPosition {
      x
      y
    }
  }
`;
