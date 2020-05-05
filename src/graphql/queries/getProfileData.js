import gql from 'graphql-tag';

export default gql`
  query ProfileData($_id: String!, $userID: String!) {
    profileUser: user(_id: $_id) {
      _id
      displayName
      profilePic
      isPro
      level
      xp
      coins
      nextXP
      ffaPoints
      wonGames
      friends {
        _id
      }
    }
    matches: userFFAMatches(_id: $_id) {
      _id
      video
      cloudFrontVideo
    }
    user(_id: $userID) {
      _id
      blockedUsers
    }
  }
`;
