import gql from 'graphql-tag';

export default gql`
  mutation CreateSuggestWord(
    $text: String!
    $hint: String!
    $actorHint: String!
    $sender: String!
    $suggestCategory: String
    $category: String
  ) {
    createSuggestWord(
      text: $text
      hint: $hint
      sender: $sender
      actorHint: $actorHint
      suggestCategory: $suggestCategory
      category: $category
    ) {
      _id
    }
  }
`;
