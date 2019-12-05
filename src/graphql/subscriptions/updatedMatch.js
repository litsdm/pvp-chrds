import gql from 'graphql-tag';

export default gql`
  subscription UpdatedMatch($userID: String!) {
    updatedMatch(userID: $userID) {
      _id
      expiresOn
      turn
      video
      score
      state
      category {
        _id
        image
      }
      players {
        _id
        profilePic
        username
      }
    }
  }
`;
