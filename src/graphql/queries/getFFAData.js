import gql from 'graphql-tag';

export default gql`
  {
    matches: FFAMatches {
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
