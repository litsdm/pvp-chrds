import gql from 'graphql-tag';

export default gql`
  mutation CreateFriendRequest($from: String!, $to: String!) {
    createFriendRequest(from: $from, to: $to) {
      _id
    }
  }
`;
