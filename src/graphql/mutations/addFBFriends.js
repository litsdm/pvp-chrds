import gql from 'graphql-tag';

export default gql`
  mutation AddFacebookFriends($_id: String!, $friendIDs: [String]!) {
    addFacebookFriends(_id: $_id, friendIDs: $friendIDs) {
      _id
    }
  }
`;
