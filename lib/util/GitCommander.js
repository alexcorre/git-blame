'use babel';

import { isArray, isFunction } from 'lodash';
import childProcess from 'child_process';

import { parseBlame } from './blameFormatter';

/**
 * @module GitCommander
 *
 * Utility for executing git commands on a repo in a given working directory.
 */
export default class GitCommander {

  constructor(path) {
    this.workingDirectory = path;
  }

  /**
   * Spawns a process to execute a git command in the GitCommander instances
   * working directory.
   *
   * @param {array|string} args - arguments to call `git` with on the command line
   * @param {function} callback - node callback for error and command output
   */
  exec(args, callback) {
    if (!isArray(args) || !isFunction(callback)) {
      return;
    }

    const child = childProcess.spawn('git', args, {cwd: this.workingDirectory});
    let stdout = '';
    let stderr = '';
    let processError;

    child.stdout.on('data', function (data) {
      stdout += data;
    });

    child.stderr.on('data', function (data) {
      stderr += data;
    });

    child.on('error', function (error) {
      processError = error;
    });

    child.on('close', function (errorCode) {
      if (processError) {
        return callback(processError);
      }

      if (errorCode) {
        const error = new Error(stderr);
        error.code = errorCode;
        return callback(error);
      }

      return callback(null, stdout.trimRight());
    });
  }

  /**
   * Executes git blame on the input file in the instances working directory
   *
   * @param {string} fileName - name of file to blame, relative to the repos
   *   working directory
   * @param {function} callback - callback funtion to call with results or error
   */
  blame(fileName, callback) {
    const args = ['blame', '--line-porcelain'];

    // ignore white space based on config
    if (atom.config.get('git-blame.ignoreWhiteSpaceDiffs')) {
      args.push('-w');
    }

    args.push(fileName);

    // Execute blame command and parse
    this.exec(args, function (err, blameStdOut) {
      if (err) {
        return callback(err, blameStdOut);
      }

      return callback(null, parseBlame(blameStdOut));
    });
  }

}
