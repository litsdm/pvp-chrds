import gql from 'graphql-tag';

export default gql`
  mutation RemoveFriend($_id: String!, $friendID: String!) {
    removeFriend(_id: $_id, friendID: $friendID) {
      _id
    }
  }
`;
