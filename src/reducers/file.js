import {
  UPDATE_PROGRESS,
  ADD_VIDEO_TO_QUEUE,
  FINISH_VIDEO_UPLOAD,
  FINISH_PIC_UPLOAD,
  UPDATE_PIC_PROGRESS,
  START_PIC_UPLOAD,
  COMPLETE_VIDEO
} from '../actions/file';

const initialState = {
  videos: {},
  completedCount: 0,
  uploadingPic: false,
  picProgress: 0
};

const fileReducer = (
  state = initialState,
  { type, file, progress, count, name }
) => {
  switch (type) {
    case ADD_VIDEO_TO_QUEUE:
      return {
        ...state,
        videos: {
          ...state.videos,
          [file.name]: file
        }
      };
    case UPDATE_PROGRESS:
      return {
        ...state,
        videos: {
          ...state.videos,
          [name]: {
            ...state.videos[name],
            progress
          }
        }
      };
    case FINISH_VIDEO_UPLOAD:
      return { ...state, videos: {}, completedCount: 0 };
    case FINISH_PIC_UPLOAD:
      return { ...state, uploadingPic: false, picProgress: 0 };
    case UPDATE_PIC_PROGRESS:
      return { ...state, picProgress: progress };
    case START_PIC_UPLOAD:
      return { ...state, uploadingPic: true };
    case COMPLETE_VIDEO:
      return { ...state, completedCount: count };
    default:
      return state;
  }
};

export default fileReducer;
