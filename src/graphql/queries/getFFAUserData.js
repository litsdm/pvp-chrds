import gql from 'graphql-tag';

export default gql`
  query FFAUserData($userID: String!) {
    user(_id: $userID) {
      _id
      coins
      ffaPoints
      ffaGuessed
      blockedUsers
    }
  }
`;
