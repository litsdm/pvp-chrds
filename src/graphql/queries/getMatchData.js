import gql from 'graphql-tag';

export default gql`
  query MatchScreenData(
    $categoryID: String!
    $opponentID: String!
    $matchID: String!
  ) {
    category(_id: $categoryID) {
      _id
      name
      image
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
      video
      actedWord {
        _id
        text
        hint
      }
      removedBy
    }
  }
`;
