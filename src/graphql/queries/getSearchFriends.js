import gql from 'graphql-tag';

export default gql`
  query SearchFriends($_id: String!, $text: String) {
    searchFriends(_id: $_id, text: $text) {
      _id
      username
      displayName
      profilePic
    }
  }
`;
