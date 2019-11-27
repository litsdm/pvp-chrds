import gql from 'graphql-tag';

export default gql`
  mutation ResolveRequest($requestID: String!, $type: String!) {
    resolveFriendRequest(requestID: $requestID, type: $type) {
      _id
    }
  }
`;
