const Blamer = require('./util/blamer');
const BlameListView = require('./views/blame-list-view');

// reference to the Blamer instance created in initializeContext if this
// project is backed by a git repository.
var projectBlamer = null;

function activate() {
  initializeContext();

  // git-blame:blame
  atom.workspaceView.command('git-blame:blame', function() {
    return blame();
  });

  return;
}

function initializeContext() {
  var editor = atom.workspace.activePaneItem;
  var projectRepo = atom.project.getRepo();

  // Ensure this project is backed by a git repository
  if (!projectRepo) {
    // TODO visually alert user
    return console.error('Cant initialize blame! there is no git repo for this project');
  }

  projectBlamer = new Blamer(projectRepo);
}

function blame() {
  // Nothing to do if projectBlamer isnt defined. Means this project is not
  // backed by git.
  if (!projectBlamer) {
    return;
  }

  var editor = atom.workspace.activePaneItem;
  var filePath = editor.getPath();

  toggleBlame(filePath);
}

// Potentially move these into a ViewController...

function getFocusedEditorContainer () {
  var activePane = atom.workspaceView.getActivePaneView();
  return activePane.find('.editor.is-focused');
}

function toggleBlame(filePath) {
  var $focusedEditor = getFocusedEditorContainer();
  if ($focusedEditor.hasClass('blaming')) {
    // kill the blame container
    $focusedEditor.removeClass('blaming');
    $focusedEditor.find('.git-blame').remove();
  } else {
    // blame the given file + show view on success
    projectBlamer.blame(filePath, function(err, blame) {
      if (err) {
        console.error('[ERROR]' + err);
      } else {
        insertBlameView(blame, $focusedEditor);
      }
    });
  }
}

function insertBlameView(blameData, focusedEditor) {
  var viewData = {
    annotations: blameData
  };
  var view = new BlameListView(viewData);
  focusedEditor.prepend(view);
  focusedEditor.addClass('blaming');
}

module.exports = {
  blame: blame,
  activate: activate
};
