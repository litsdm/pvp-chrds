import gql from 'graphql-tag';

export default gql`
  subscription CreatedMatch($userID: String!) {
    createdMatch(userID: $userID) {
      _id
      expiresOn
      turn
      video
      score
      state
      removedBy
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
