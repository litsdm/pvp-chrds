import gql from 'graphql-tag';

export default gql`
  query User($userID: String!) {
    user(_id: $userID) {
      _id
      displayName
      coins
      acceptedEula
    }
  }
`;
