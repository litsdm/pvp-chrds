import gql from 'graphql-tag';

export default gql`
  query GetPlayPopupData($_id: String!) {
    categories {
      _id
      name
      description
      image
      color
      price
      proOnly
    }
    friends(_id: $_id) {
      _id
      username
      displayName
      profilePic
    }
    user(_id: $_id) {
      _id
      displayName
      categories
      coins
      isPro
      lives
    }
  }
`;
