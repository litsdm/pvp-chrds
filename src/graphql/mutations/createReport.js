import gql from 'graphql-tag';

export default gql`
  mutation CreateReport(
    $reason: String!
    $message: String!
    $sender: String!
    $matchID: String!
  ) {
    createReport(
      reason: $reason
      message: $message
      sender: $sender
      match: $matchID
    ) {
      _id
    }
  }
`;
