import gql from 'graphql-tag';

export default gql`
  mutation UpdateMatch($matchID: String!, $properties: String!) {
    updateMatch(_id: $matchID, properties: $properties) {
      _id
    }
  }
`;
