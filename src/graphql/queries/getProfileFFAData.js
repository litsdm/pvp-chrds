import gql from 'graphql-tag';

export default gql`
  query ProfileData($_id: String!) {
    matches: userFFAMatches(_id: $_id) {
      _id
      createdOn
      cameraType
      cloudFrontVideo
      video
      viewedHash
      uniqueViewCount
      sender {
        _id
        displayName
      }
      actedWord {
        _id
        text
        hint
      }
      category {
        _id
        name
      }
    }
  }
`;
