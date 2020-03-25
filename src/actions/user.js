export const LOGOUT = 'LOGOUT';
export const REFETCH_USER = 'REFETCH_USER';

export const logoutUser = () => ({
  type: LOGOUT
});

export const setRefetchUser = (refetchUser = false) => ({
  refetchUser,
  type: REFETCH_USER
});
