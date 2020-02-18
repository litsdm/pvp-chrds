import gql from 'graphql-tag';

export default gql`
  {
    matches: FFAMatches {
      _id
      video
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
