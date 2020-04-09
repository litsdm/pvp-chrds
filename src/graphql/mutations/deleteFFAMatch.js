import gql from 'graphql-tag';

export default gql`
  mutation DeleteFFAMatch($_id: String!) {
    deleteFFAMatch(_id: $_id) {
      _id
    }
  }
`;
