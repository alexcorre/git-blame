var GitTools = require('git-tools');

function activate() {
  console.log('activate');

  // Register git-blame:blame
  atom.workspaceView.command('git-blame:blame', function() {
    return blame();
  });

  return;
}

function blame() {
  var editor = atom.workspace.activePaneItem;
  var repo = atom.project.getRepo();
  var repoPath = repo && repo.getPath();

  // we need to have a repo path
  if (!repoPath) {
    return console.error('no repo for this thing...');
  }

  var filePath = editor.getPath();
  filePath = repo.relativize(filePath);

  GitTools.isRepo(repoPath, function(err, isRepo) {
    if (err) {
      console.error('ERROR: ', err);
    }

    if (isRepo) {
      var projectRepo = new GitTools(repoPath);
      var blameOptions = {
        path: filePath,
        committish: 'HEAD'
      };

      projectRepo.blame(blameOptions, function(err, blame) {
        if (err) {
          console.error(err);
        } else {
          console.log('blame: ', blame);
        }
      });
    }
  });


  return console.log('BLAMING');
}

module.exports = {
  blame: blame,
  activate: activate
};
