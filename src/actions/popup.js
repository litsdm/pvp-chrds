export const TOGGLE_PLAY = 'TOGGLE_PLAY';
export const TOGGLE_CATEGORY = 'TOGGLE_CATEGORY';
export const TOGGLE_ADD = 'TOGGLE_ADD';

export const togglePlay = (display, data = {}) => ({
  display,
  data,
  type: TOGGLE_PLAY
});

export const toggleCategory = (display, data = {}) => ({
  display,
  data,
  type: TOGGLE_CATEGORY
});

export const toggleAdd = display => ({
  display,
  type: TOGGLE_ADD
});
