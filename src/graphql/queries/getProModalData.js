import gql from 'graphql-tag';

export default gql`
  query ProModalData($_id: String!) {
    user(_id: $_id) {
      _id
      lives
    }
  }
`;
