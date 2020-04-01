import gql from 'graphql-tag';

export default gql`
  query GetFFAData($userID: String!, $skip: Int!, $stopFilter: Boolean!) {
    FFAData: FFAMatches(_id: $userID, skip: $skip, stopFilter: $stopFilter) {
      newMatches {
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
      seenMatches {
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
      stopFilter
      skip
    }
  }
`;
