import React, { useState } from 'react';
import { arrayOf, object, func, string } from 'prop-types';

import callApi from '../helpers/apiCaller';

import FormModal from './FormModal';

const PickUsernameModal = ({
  close,
  name,
  appleID,
  facebookID,
  friends,
  displayBadge,
  onSuccess
}) => {
  const [displayName, setDisplayName] = useState(name);

  const setState = (key, value) => {
    if (key === 'username') setDisplayName(value);
  };

  const handleSubmit = async () => {
    try {
      const method = facebookID ? 'facebook' : 'apple';
      const payload = {
        username: displayName.toLowerCase(),
        appleID,
        facebookID,
        displayName,
        friends
      };
      const response = await callApi('signup', payload, 'POST');
      const { token, message } = await response.json();

      if (message) throw new Error(message);

      onSuccess(token, method, true);
    } catch (exception) {
      displayBadge(exception.message, 'error');
    }
  };

  return (
    <FormModal
      close={close}
      title="Pick a username"
      labels={['Username']}
      values={[displayName]}
      setState={setState}
      submit={handleSubmit}
    />
  );
};

PickUsernameModal.propTypes = {
  close: func.isRequired,
  name: string.isRequired,
  appleID: string,
  facebookID: string,
  friends: arrayOf(object),
  displayBadge: func.isRequired,
  onSuccess: func.isRequired
};

PickUsernameModal.defaultProps = {
  appleID: '',
  facebookID: '',
  friends: []
};

export default PickUsernameModal;
