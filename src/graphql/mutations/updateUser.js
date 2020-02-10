import gql from 'graphql-tag';

export default gql`
  mutation UpdateUser($id: String!, $properties: String!) {
    updateUser(_id: $id, properties: $properties) {
      _id
      username
      categories
      displayName
      token
    }
  }
`;
