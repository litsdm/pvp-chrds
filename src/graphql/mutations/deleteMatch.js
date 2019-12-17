import gql from 'graphql-tag';

export default gql`
  mutation DeleteMatch($_id: String!) {
    deleteMatch(_id: $_id) {
      _id
    }
  }
`;
