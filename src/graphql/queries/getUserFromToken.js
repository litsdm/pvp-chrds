import gql from 'graphql-tag';

export default gql`
  query User($token: String!) {
    user(token: $token) {
      _id
      username
      email
      profilePic
      coins
      level
      xp
    }
  }
`;
