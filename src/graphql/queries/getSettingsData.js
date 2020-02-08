import gql from 'graphql-tag';

export default gql`
  query SettingsData($_id: String!) {
    user(_id: $_id) {
      _id
      username
      displayName
      profilePic
      facebookID
    }
    friendRequests(_id: $_id) {
      _id
    }
  }
`;
