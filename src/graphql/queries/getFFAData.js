import gql from 'graphql-tag';

export default gql`
  query GetFFAData($userID: String!, $skip: Int!) {
    newMatches: FFAMatchesBasic(_id: $userID, skip: $skip) {
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
        allowShare
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
