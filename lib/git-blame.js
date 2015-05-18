const Blamer = require('./util/blamer');
const BlameViewController = require('./controllers/blameViewController');
const errorController = require('./controllers/errorController');
const Directory = require('pathwatcher').Directory
const path = require('path');

// reference to the Blamer instance created in initializeContext if this
// project is backed by a git repository.
var projectBlamers = {}

function activate() {
  // git-blame:blame
  atom.commands.add('atom-workspace', 'git-blame:toggle', toggleBlame);
}


function toggleBlame() {
  var editor = atom.workspace.getActivePaneItem()
  if (!editor) return;

  // An unsaved file has no filePath
  filePath = editor.getPath()
  if (!filePath) return;

  // blaming an empty file is useless
  if (editor.isEmpty()) return;

  return atom.project.repositoryForDirectory(new Directory(path.dirname(filePath))).then(
    function(projectRepo) {
      // Ensure this project is backed by a git repository
      if (!projectRepo) {
        errorController.showError('error-not-backed-by-git');
        return;
      }

      if (!(projectRepo.path in projectBlamers)) {
        projectBlamers[projectRepo.path] = new Blamer(projectRepo);
      }

      BlameViewController.toggleBlame(projectBlamers[projectRepo.path]);
    });

}


// EXPORTS
module.exports = {
  config: {
    "useCustomUrlTemplateIfStandardRemotesFail": {
      type: 'boolean',
      default: false
    },
    "customCommitUrlTemplateString": {
      type: 'string',
      default: 'Example -> https://github.com/<%- project %>/<%- repo %>/commit/<%- revision %>'
    },
    "dateFormatString": {
      type: 'string',
      default: 'YYYY-MM-DD'
    },
    "ignoreWhiteSpaceDiffs": {
      type: 'boolean',
      default: false
    }
  },

  toggleBlame: toggleBlame,
  activate: activate
};
