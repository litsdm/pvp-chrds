import gql from 'graphql-tag';

export default gql`
  {
    categories {
      _id
      name
      description
    }
  }
`;
