import gql from 'graphql-tag';

export default gql`
  query Friends($_id: String!) {
    friends(_id: $_id) {
      _id
      username
      email
      profilePic
    }
  }
`;
