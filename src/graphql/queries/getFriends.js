import gql from 'graphql-tag';

export default gql`
  query Friends($_id: String!) {
    friends(_id: $_id) {
      _id
      username
      displayName
      profilePic
    }
    friendRequests(_id: $_id) {
      _id
      from {
        _id
        username
        displayName
        profilePic
      }
    }
  }
`;
