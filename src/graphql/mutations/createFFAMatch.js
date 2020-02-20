import gql from 'graphql-tag';

export default gql`
  mutation CreateFFAMatch(
    $sender: String!
    $category: String!
    $actedWord: String!
    $video: String!
    $cameraType: Int!
  ) {
    createFFAMatch(
      sender: $sender
      category: $category
      actedWord: $actedWord
      video: $video
      cameraType: $cameraType
    ) {
      _id
    }
  }
`;
