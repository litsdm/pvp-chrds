import gql from 'graphql-tag';

export default gql`
  mutation MakePro($_id: String!, $coins: Int!) {
    makePro(_id: $_id, coins: $coins) {
      _id
      coins
      isPro
      proDate
    }
  }
`;
