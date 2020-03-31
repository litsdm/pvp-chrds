import gql from 'graphql-tag';

export default gql`
  mutation CreateSuggestCategory(
    $name: String!
    $description: String!
    $sender: String!
  ) {
    createSuggestCategory(
      name: $name
      description: $description
      sender: $sender
    ) {
      _id
    }
  }
`;
