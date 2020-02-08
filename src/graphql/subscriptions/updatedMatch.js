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
      removedBy
      actedWord {
        _id
        text
        hint
      }
      category {
        _id
        image
      }
      players {
        _id
        profilePic
        username
        displayName
      }
    }
  }
`;
