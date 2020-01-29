import gql from 'graphql-tag';

export default gql`
  query GetCategoryUser($_id: String!) {
    user(_id: $_id) {
      _id
      categories
      coins
    }
  }
`;
