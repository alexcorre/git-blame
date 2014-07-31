const _ = require('underscore');
const $ = require('atom').$;
const React = require('atom').React;
const BlameListView = require('../views/blame-list-view');
const errorController = require('../controllers/errorController');

const TOGGLE_DEBOUNCE_TIME = 600;

/**
 * Getter for the currently focused editor.
 *
 * @return {JQuery} - The currently focused editor element.
 */
function getFocusedEditorView () {
  var activePane = atom.workspaceView.getActivePaneView();
  return activePane.find('.editor.is-focused').view();
}

/**
 * If active editor is not currently blaming funs blame command for given
 * file and blamer and inserts a BlameView for the file. If blame data is already
 * shown it removes that element.
 *
 * @param {String} filePath - path to the file to blame
 * @param {Blamer} projectBlamer - a fully initialized Blamer for the current project
 */
function toggleBlame(filePath, projectBlamer) {
  var focusedEditor = getFocusedEditorView();
  if (focusedEditor.blameView) {
    // we're already blaming this container, so unmount
    focusedEditor.blameView = null;
    var mountPoint = focusedEditor.find('.git-blame-mount');
    React.unmountComponentAtNode(mountPoint);
    mountPoint.remove();
  } else {
    // blame the given file + show view on success
    projectBlamer.blame(filePath, function(err, blameData) {
      if (err) {
        errorController.handleError(err);
      } else {
        insertBlameView(blameData, focusedEditor);
      }
    });
  }
}

/**
 * Debounced version of toggleBlame that will only allow toggleBlame function
 * to be executed 700ms after the last execution. Executes immediately the first
 * time its called.
 */
var debouncedToggleBlame = _.debounce(toggleBlame, TOGGLE_DEBOUNCE_TIME, true);

/**
 * Inserts a BlameView rendered from input blameData into its proper
 * spot within the focusedEditor.
 *
 * @param {Array|Object} blameData - array of data for a blame of each line output
 *    of blameFormatter
 * @param {JQuery} focusedEditor - the currently focused editor element in which
 *    the BlameView should be inserted
 */
function insertBlameView(blameData, focusedEditor) {
  // insert the BlameListView after the gutter div
  var mountPoint = $('<div>', {'class': 'git-blame-mount'});
  focusedEditor.find('.gutter').after(mountPoint);

  var blameView = new BlameListView({
    annotations: blameData,
    scrollbar: focusedEditor.find('.vertical-scrollbar')
  });
  React.renderComponent(blameView, mountPoint[0]);

  focusedEditor.blameView = blameView;
}

// EXPORTS
module.exports = {
  toggleBlame: debouncedToggleBlame
};
