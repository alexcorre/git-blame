'use babel';

import strings from '../locales/strings';

/**
 * Shows an error to the user with the given message.
 *
 * @param {String} errorMessage - Error message to show the user
 */
export function showError(errorMessageKey) {
  const messageString = strings[errorMessageKey];
  if (messageString) {
    atom.notifications.addError(messageString, {dismissable: true});
  }
}
