import gql from 'graphql-tag';

export default gql`
  mutation MakeMember($_id: String!, $coins: Int!, $email: String!) {
    makeMember(_id: $_id, coins: $coins, email: $email) {
      _id
      coins
      isPro
      proDate
    }
  }
`;
