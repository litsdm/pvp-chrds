export const TOGGLE_PLAY = 'TOGGLE_PLAY';
export const TOGGLE_CATEGORY = 'TOGGLE_CATEGORY';
export const TOGGLE_ADD = 'TOGGLE_ADD';
export const TOGGLE_BADGE = 'TOGGLE_BADGE';
export const TOGGLE_PROGRESS_BADGE = 'TOGGLE_PROGRESS_BADGE';
export const TOGGLE_NETWORK_MODAL = 'TOGGLE_NETWORK_MODAL';
export const TOGGLE_PURCHASE_MODAL = 'TOGGLE_PURCHASE_MODAL';

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

export const toggleProgressBadge = display => ({
  display,
  type: TOGGLE_PROGRESS_BADGE
});

export const toggleNetworkModal = display => ({
  display,
  type: TOGGLE_NETWORK_MODAL
});

export const togglePurchaseModal = display => ({
  display,
  type: TOGGLE_PURCHASE_MODAL
});

export const toggleBadge = (
  display = false,
  message = '',
  type = 'default'
) => ({
  type: TOGGLE_BADGE,
  badge: {
    display,
    message,
    type
  }
});
