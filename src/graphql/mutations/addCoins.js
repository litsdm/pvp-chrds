import gql from 'graphql-tag';

export default gql`
  mutation AddCoins($_id: String!, $coins: Int!) {
    addCoins(_id: $_id, coins: $coins) {
      _id
      coins
    }
  }
`;
