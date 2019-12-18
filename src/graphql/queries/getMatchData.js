import gql from 'graphql-tag';

export default gql`
  query MatchScreenData(
    $categoryID: String!
    $opponentID: String!
    $matchID: String!
  ) {
    category(_id: $categoryID) {
      _id
      image
    }
    opponent: userByID(_id: $opponentID) {
      _id
      profilePic
      username
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
