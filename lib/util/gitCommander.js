const _ = require('underscore');
const child_process = require('child_process');

// formatters
const blameFormatter = require('./blameFormatter');

/**
 * @module GitCommander
 *
 * Utility for executing git commands on a repo in a given working directory.
 */
function GitCommander(path) {
  this.workingDirectory = path;
}

// ================
// Instance Methods
// ================

_.extend(GitCommander.prototype, {

  /**
   * Spawns a process to execute a git command in the GitCommander instances
   * working directory.
   *
   * @param {array|string} args - arguments to call `git` with on the command line
   * @param {function} callback - node callback for error and command output
   */
  exec: function(args, callback) {
    if (!_.isArray(args) || !_.isFunction(callback)) {
      return;
    }

    var stdout = '';
    var stderr = '';
    var child = child_process.spawn('git', args, {cwd: this.workingDirectory});
    var processError;

    child.stdout.on('data', function(data) {
      stdout += data;
    });

    child.stderr.on('data', function(data) {
      stderr += data;
    });

    child.on('error', function(error) {
      processError = error;
    });

    child.on('close', function(errorCode) {
      if (processError) {
        return callback(processError);
      }

      if (errorCode) {
        var error = new Error(stderr);
        error.code = errorCode;
        return callback(error);
      }

      return callback(null, stdout.trimRight());
    });
  },

  /**
   * Executes git blame on the input file in the instances working directory
   *
   * @param {string} fileName - name of file to blame, relative to the repos
   *   working directory
   * @param {function} callback - callback funtion to call with results or error
   */
  blame: function(fileName, callback) {
    var args = ['blame', '--line-porcelain'];

    // ignore white space based on config
    if (atom.config.get('git-blame.ignoreWhiteSpaceDiffs')) {
      args.push('-w');
    }

    args.push(fileName);

    // Execute blame command and parse
    this.exec(args, function(err, blame) {
      if (err) {
        return callback(err, blame);
      }

      return callback(null, blameFormatter.parseBlame(blame));
    });
  }
});

// ================
// Exports
// ================

module.exports = GitCommander;
