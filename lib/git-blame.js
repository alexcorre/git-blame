var GitTools = require('git-tools');
var _ = require('underscore');

function activate() {
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

function blame() {
  var editor = atom.workspace.activePaneItem;
  var projectRepo = atom.project.getRepo();

  // Ensure this project is backed by a git repository
  if (!projectRepo || !projectRepo.getPath()) {
    return console.error('Cant blame! there is no git repo for this project');
  }

  // get file path for active editor pane + relativize it to the repo root
  var filePath = editor.getPath();
  filePath = projectRepo.relativize(filePath);

  var isInSubmodule = isPathInSubmodule(projectRepo, filePath);
  if (isInSubmodule) {
    return console.log('this file is in a submodule. Submodules are not yet supported');
  }

  var projectRepoTools = new GitTools(projectRepo.getPath());
  var blameOptions = {
    path: filePath,
    committish: 'HEAD'
  };

  projectRepoTools.blame(blameOptions, function(err, blame) {
    if (err) {
      console.error(err);
    } else {
      console.log('blame: ', blame);
    }
  });
}

module.exports = {
  blame: blame,
  activate: activate
};
