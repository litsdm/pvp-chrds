import gql from 'graphql-tag';

export default gql`
  query SuggestionData($_id: String!) {
    suggestedCategories: userSuggestedCategories(_id: $_id) {
      _id
      name
      status
    }
    categories {
      _id
      name
      image
    }
  }
`;
