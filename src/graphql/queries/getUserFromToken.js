import gql from 'graphql-tag';

export default gql`
  query User($token: String!) {
    user(token: $token) {
      _id
      username
      profilePic
      coins
      level
      xp
    }
  }
`;
