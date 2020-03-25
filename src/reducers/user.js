import { REFETCH_USER } from '../actions/user';

const initialState = { refetchUser: false };

const userReducer = (state = initialState, { type, refetchUser }) => {
  switch (type) {
    case REFETCH_USER:
      return { ...state, refetchUser };
    default:
      return state;
  }
};

export default userReducer;
