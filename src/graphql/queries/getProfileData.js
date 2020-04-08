import gql from 'graphql-tag';

export default gql`
  query ProfileData($_id: String!) {
    user(_id: $_id) {
      _id
      displayName
      profilePic
      isPro
      level
      xp
      nextXP
      ffaPoints
      wonGames
    }
    matches: userFFAMatches(_id: $_id) {
      _id
      video
      cloudFrontVideo
    }
  }
`;
