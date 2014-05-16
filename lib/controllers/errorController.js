const _ = require('underscore');
const BlameErrorView = require('../views/blame-error-view');
const strings = require('../locales/strings');

/**
 * A mapping from git error message fragment to the strings error key. When an
 * error is thrown by the blamer, we try to match the errors message to something
 * in this map to decide which message to show the user.
 */
var gitErrorMessageMap = {
  'no such path': 'error-file-path-not-checked-in'
};

/**
 * Shows an error to the user with the given message.
 *
 * @param {String} errorMessage - Error message to show the user
 */
function showError(errorMessageKey) {
  var messageString = strings[errorMessageKey];

  if (messageString) {
    var errorView = new BlameErrorView({message: messageString});
    errorView.attach();
  }

}

/**
 * Handles an error by decoding the message into one to show the user, or just swallowing it.
 *
 * @param {Error} error - The error to be handled.
 */
function handleError(error) {
  var gitErrorKey = _.find(_.keys(gitErrorMessageMap), function(gitErrorFragment) {
    var regex = new RegExp(gitErrorFragment);
    return regex.test(error.message);
  });

  var userMessageKey = gitErrorKey ? gitErrorMessageMap[gitErrorKey] : '';
  if (userMessageKey) {
    // Show the user an error if there is a matching key...
    showError(userMessageKey);
  }
}

// EXPORTS
module.exports = {
  handleError: handleError,
  showError: showError
};
