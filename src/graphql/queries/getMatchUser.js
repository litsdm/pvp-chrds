import gql from 'graphql-tag';

export default gql`
  query User($_id: String!) {
    user(_id: $_id) {
      _id
      level
      xp
      nextXP
      wonGames
      coins
    }
  }
`;
