import gql from 'graphql-tag';

export default gql`
  mutation CreateFFAMatch(
    $sender: String!
    $category: String!
    $actedWord: String!
    $video: String!
  ) {
    match: createFFAMatch {
      _id
    }
  }
`;
