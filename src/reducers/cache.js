import { SET_CACHE, ADD_THUMBNAIL } from '../actions/cache';

const initialState = { thumbnails: {} };

const cacheReducer = (
  state = initialState,
  { type, _id, thumbnail, cache }
) => {
  switch (type) {
    case SET_CACHE:
      return { ...state, ...cache };
    case ADD_THUMBNAIL:
      return {
        ...state,
        thumbnails: { ...state.thumbnails, [_id]: thumbnail }
      };
    default:
      return state;
  }
};

export default cacheReducer;
