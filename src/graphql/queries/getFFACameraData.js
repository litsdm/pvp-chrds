import gql from 'graphql-tag';

export default gql`
  query CameraScreenData($categoryID: String!) {
    category(_id: $categoryID) {
      _id
      image
      name
      color
      words {
        _id
        text
        hint
        actorHint
        allowMic
      }
    }
  }
`;
