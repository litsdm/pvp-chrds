import gql from 'graphql-tag';

export default gql`
  mutation CreateMatch(
    $players: [String]!
    $category: String!
    $turn: String!
    $score: String!
  ) {
    match: createMatch(
      players: $players
      category: $category
      turn: $turn
      score: $score
    ) {
      _id
    }
  }
`;
