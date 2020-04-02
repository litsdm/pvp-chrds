import gql from 'graphql-tag';

export default gql`
  query PopupData($_id: String!) {
    user(_id: $_id) {
      _id
      isPro
      lives
      coins
    }
  }
`;
