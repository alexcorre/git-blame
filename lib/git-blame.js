const GitTools = require('git-tools');
const Blamer = require('./blamer');

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

function isPathInSubmodule(repo, path) {
  var submodules = repo.submodules;
  if (submodules) {
    for (var submodulePath in submodules) {
      var submoduleRegex = new RegExp('^' + submodulePath);
      if (submoduleRegex.test(path)) {
        return true;
      }
    }
  }

  return false;
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
  var editor = atom.workspace.activePaneItem;
  var filePath = editor.getPath();
  projectBlamer.blame(filePath, function(err, blame) {
    if (err) {
      console.error(err);
    } else {
      console.log('BLAME', blame);
    }
  });
}

module.exports = {
  blame: blame,
  activate: activate
};
