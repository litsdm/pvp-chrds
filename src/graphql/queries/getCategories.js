import gql from 'graphql-tag';

export default gql`
  {
    categories {
      _id
      name
      description
      image
      color
      isFeatured
      featureImage
      price
      words {
        _id
        text
        hint
      }
    }
  }
`;
