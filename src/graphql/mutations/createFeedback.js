import gql from 'graphql-tag';

export default gql`
  mutation CreateFeedback($type: String!, $message: String!, $sender: String!) {
    createFeedback(type: $type, message: $message, sender: $sender) {
      _id
    }
  }
`;
