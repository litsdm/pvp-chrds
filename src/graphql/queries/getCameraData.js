import gql from 'graphql-tag';

export default gql`
  query CameraScreenData(
    $categoryID: String!
    $opponentID: String!
    $matchID: String!
  ) {
    category(_id: $categoryID) {
      _id
      image
      words
    }
    opponent: userByID(_id: $opponentID) {
      _id
      profilePic
      username
    }
    match(_id: $matchID) {
      _id
      score
      replayWord
    }
  }
`;
