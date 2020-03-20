import gql from 'graphql-tag';

export default gql`
  query HomeData($_id: String!) {
    user(_id: $_id) {
      _id
      username
      displayName
      profilePic
      coins
      level
      xp
      nextXP
      facebookID
      categories
      acceptedEula
    }
    friendRequests(_id: $_id) {
      _id
    }
    ffaMatchCount(_id: $_id)
  }
`;
