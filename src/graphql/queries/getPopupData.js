import gql from 'graphql-tag';

export default gql`
  {
    displayAdd
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
