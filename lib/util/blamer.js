const _ = require('underscore');
const GitCommander = require('./gitCommander');

/**
 * @module Blamer
 *
 * Blamer is a Class that should be instantiated with an atom 'Git' object
 * for the root repository in the project.
 *
 * @param {Git} repo - an instance of 'Git' class from atom workspace. See
 *   https://atom.io/docs/api/v0.92.0/api/ for more info.
 */
var Blamer = function(repo) {
  if (!repo) {
    throw new Error('Cannot create a Blamer without a repository.');
  }

  this.repo = repo;
  this.initialize();
}

/**
 * Initializes this Blamer instance, by creating git-tools repos for the root
 * repository and submodules.
 */
Blamer.prototype.initialize = function() {
  this.tools = {};
  this.tools.root = new GitCommander(this.repo.getWorkingDirectory());

  var submodules = this.repo.submodules;
  if (submodules) {
    for (var submodulePath in submodules) {
      this.tools[submodulePath] = new GitCommander(this.repo.getWorkingDirectory() + '/' + submodulePath);
    }
  }
}

/**
 * Blames the given filePath and calls callback with blame lines or error.
 *
 * @param {string} filePath - filePath to blame
 * @param {function} callback - callback to call back with blame data
 */
Blamer.prototype.blame = function(filePath, callback) {
  // Ensure file path is relative to root repo
  filePath = this.repo.relativize(filePath);
  var repoUtil = this.repoUtilForPath(filePath);

  // Ensure that if this file is in a submodule, we remove the submodule dir
  // from the path
  filePath = this.removeSubmodulePrefix(filePath);

  if (!_.isFunction(callback)) {
    throw new Error('Must be called with a callback function');
  }

  // Make the async blame call on the git repo
  repoUtil.blame(filePath, function(err, blame) {
    callback(err, blame);
  });
}

/**
 * Utility to get the GitCommander repository for the given filePath. Takes into
 * account whether the file is part of a submodule and returns that repository
 * if necessary.
 *
 * @param {string} filePath - the path to the file in question.
 */
Blamer.prototype.repoUtilForPath = function(filePath) {
  var submodules = this.repo.submodules;

  // By default, we return the root GitCommander repository.
  var repoUtil = this.tools.root;

  // if we have submodules, loop through them and see if the given file path
  // belongs inside one of the repositories. If so, we return the GitCommander repo
  // for that submodule.
  if (submodules) {
    for (var submodulePath in submodules) {
      var submoduleRegex = new RegExp('^' + submodulePath);
      if (submoduleRegex.test(filePath)) {
        repoUtil = this.tools[submodulePath];
      }
    }
  }

  return repoUtil;
}

/**
 * If the file path given is inside a submodule, removes the submodule
 * directory prefix.
 *
 * @param {string} filePath - path to file to relativize
 * @param {Repo} toolsRepo - git-tools Repo
 */
Blamer.prototype.removeSubmodulePrefix = function(filePath) {
  var submodules = this.repo.submodules;
  if (submodules) {
    for (var submodulePath in submodules) {
      var submoduleRegex = new RegExp('^' + submodulePath);
      if (submoduleRegex.test(filePath)) {
        filePath = filePath.replace(submoduleRegex, '');
      }
    }
  }

  // remove leading '/' if there is one before returning
  filePath = filePath.replace(/^\//, '');
  return filePath;
}

module.exports = Blamer;
