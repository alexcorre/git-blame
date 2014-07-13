const _ = require('underscore');
const $ = require('atom').$;
const BlameListView = require('../views/blame-list-view');
const errorController = require('../controllers/errorController');

const TOGGLE_DEBOUNCE_TIME = 600;
const SELECTOR_REACT = '.editor-contents > .gutter';
const SELECTOR = '.gutter';

/**
 * Getter for the currently focused editor.
 *
 * @return {JQuery} - The currently focused editor element.
 */
function getFocusedEditorContainer () {
  var activePane = atom.workspaceView.getActivePaneView();
  return activePane.find('.editor.is-focused');
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
  var $focusedEditor = getFocusedEditorContainer();
  if ($focusedEditor.hasClass('blaming')) {
    // kill the blame container if we're already blaming this container
    $focusedEditor.removeClass('blaming');
    $focusedEditor.find('.git-blame').remove();

    // unbind the scroll event
    $focusedEditor.find('.vertical-scrollbar').off('scroll');
  } else {
    // blame the given file + show view on success
    projectBlamer.blame(filePath, function(err, blame) {
      if (err) {
        errorController.handleError(err);
      } else {
        insertBlameView(blame, $focusedEditor);
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
 * Makes the view arguments scroll position match the target elements scroll position
 *
 * @param {JQuery} view - the view whose scrollTop to adjust
 * @param {JQuery} target - element whose scrollTop should be matched
 */
function matchScrollPosition(view, target) {
  var targetScrollTop = target.scrollTop();
  view.scrollTop(targetScrollTop);
}

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
  var viewData = {
    annotations: blameData
  };
  var blameView = new BlameListView(viewData);
  var verticalScrollBar = focusedEditor.find('.vertical-scrollbar');

  // Bind to scroll event on vertical-scrollbar for now to sync up scroll
  // position of blame gutter.
  verticalScrollBar.on('scroll', function(e) {
    matchScrollPosition(blameView, $(e.target));
  });

  // insert the BlameListView after the gutter div
  var selector = focusedEditor.hasClass('react') ? SELECTOR_REACT : SELECTOR;
  focusedEditor.find(selector).after(blameView);
  focusedEditor.addClass('blaming');

  // match scroll positions in case we blame at a scrolled position
  matchScrollPosition(blameView, verticalScrollBar);
}

// EXPORTS
module.exports = {
  toggleBlame: debouncedToggleBlame
}
