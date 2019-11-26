import gql from 'graphql-tag';

export default gql`
  {
    users {
      _id
      email
      username
      profilePic
    }
  }
`;
