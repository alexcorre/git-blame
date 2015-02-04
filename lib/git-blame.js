const Blamer = require('./util/blamer');
const BlameViewController = require('./controllers/blameViewController');
const errorController = require('./controllers/errorController');

// reference to the Blamer instance created in initializeContext if this
// project is backed by a git repository.
var projectBlamer = null;

function activate() {
  initializeContext();

  // git-blame:blame
  atom.commands.add('atom-workspace', 'git-blame:toggle', toggleBlame);
}

function initializeContext() {
  var projectRepo = atom.project.getRepo();

  // Ensure this project is backed by a git repository
  if (!projectRepo) {
    errorController.showError('error-not-backed-by-git');
    return;
  }

  projectBlamer = new Blamer(projectRepo);
}

function toggleBlame() {
  // Nothing to do if projectBlamer isnt defined. Means this project is not
  // backed by git.
  if (!projectBlamer) {
    return;
  }
  BlameViewController.toggleBlame(projectBlamer);
}

// EXPORTS
module.exports = {
  configDefaults: {
    useCustomUrlTemplateIfStandardRemotesFail: false,
    customCommitUrlTemplateString: 'Example -> https://github.com/<%- project %>/<%- repo %>/commit/<%- revision %>',
    dateFormatString: 'YYYY-MM-DD',
    ignoreWhiteSpaceDiffs: false
  },
  toggleBlame: toggleBlame,
  activate: activate
};
