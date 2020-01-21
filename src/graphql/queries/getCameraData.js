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
      name
      color
      words {
        _id
        text
        hint
        allowMic
      }
    }
    opponent: user(_id: $opponentID) {
      _id
      profilePic
      username
      displayName
    }
    match(_id: $matchID) {
      _id
      score
      replayWord {
        _id
        text
        hint
        allowMic
      }
    }
  }
`;
