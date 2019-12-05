import gql from 'graphql-tag';

export default gql`
  subscription CreatedMatch {
    createdMatch {
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
