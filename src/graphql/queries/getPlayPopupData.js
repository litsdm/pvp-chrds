import gql from 'graphql-tag';

export default gql`
  query GetPlayPopupData($token: String!, $_id: String!) {
    categories {
      _id
      name
      description
      image
      color
    }
    friends(_id: $_id) {
      _id
      username
      email
      profilePic
    }
    user(token: $token) {
      _id
    }
  }
`;
