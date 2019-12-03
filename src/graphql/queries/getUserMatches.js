import gql from 'graphql-tag';

export default gql`
  query UserMatches($_id: String!) {
    matches: userMatches(_id: $_id) {
      _id
      expiresOn
      turn
      video
      score
      category {
        _id
        image
      }
      players {
        _id
        profilePic
        username
      }
    }
  }
`;
