import gql from 'graphql-tag';

export default gql`
  mutation ChangePassword(
    $_id: String!
    $currentPassword: String!
    $newPassword: String!
  ) {
    changePassword(
      _id: $_id
      currentPassword: $currentPassword
      newPassword: $newPassword
    )
  }
`;
