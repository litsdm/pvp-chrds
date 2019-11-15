import gql from 'graphql-tag';

export default gql`
  query UserMatches($_id: String!) {
    userMatches(_id: $_id) {
      expiresOn
      turn
      video
      score
      category {
        _id
      }
      players {
        _id
        profilePic
      }
    }
  }
`;
