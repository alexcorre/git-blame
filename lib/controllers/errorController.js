'use babel';

import _ from 'underscore';
import BlameErrorView  from '../views/blame-error-view';
import strings from '../locales/strings';

/**
 * Shows an error to the user with the given message.
 *
 * @param {String} errorMessage - Error message to show the user
 */
function showError(errorMessageKey) {
  const messageString = strings[errorMessageKey];

  if (messageString) {
    var errorView = new BlameErrorView({message: messageString});
    errorView.attach();
  }

}

// EXPORTS
export default {
  showError,
};
