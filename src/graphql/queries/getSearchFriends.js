import gql from 'graphql-tag';

export default gql`
  query SearchFriends($_id: String!) {
    searchFriends(_id: $_id) {
      _id
      email
      username
      profilePic
    }
  }
`;
