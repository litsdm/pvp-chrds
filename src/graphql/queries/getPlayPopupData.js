import gql from 'graphql-tag';

export default gql`
  query GetPlayPopupData($_id: String!) {
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
      profilePic
    }
    user(_id: $_id) {
      _id
    }
  }
`;
