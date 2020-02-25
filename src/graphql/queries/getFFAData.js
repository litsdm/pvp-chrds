import gql from 'graphql-tag';

export default gql`
  query GetFFAData($userID: String!, $skip: Int!) {
    matches: FFAMatches(_id: $userID, skip: $skip) {
      _id
      video
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
