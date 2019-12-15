import gql from 'graphql-tag';

export default gql`
  mutation UpdateMatchScreenData(
    $userID: String!
    $matchID: String!
    $userProperties: String!
    $matchProperties: String!
  ) {
    updateMatch(_id: $matchID, properties: $matchProperties) {
      _id
    }
    updateUser(_id: $userID, properties: $userProperties) {
      username
      token
    }
  }
`;
