'use babel';

import { isFunction, each } from 'lodash';
import GitCommander from './GitCommander';

export default class Blamer {

  constructor(repo) {
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
  initialize() {
    this.tools = {};
    this.tools.root = new GitCommander(this.repo.getWorkingDirectory());

    const submodules = this.repo.submodules;
    if (submodules) {
      each(submodules, (submodulePath) => {
        this.tools[submodulePath] = new GitCommander(`${this.repo.getWorkingDirectory()}/${submodulePath}`);
      });
    }
  }

  /**
   * Blames the given filePath and calls callback with blame lines or error.
   *
   * @param {string} filePath - filePath to blame
   * @param {function} callback - callback to call back with blame data
   */
  blame(filePath, callback) {
    // Ensure file path is relative to root repo
    let cleanedFilePath = this.repo.relativize(filePath);
    const repoUtil = this.repoUtilForPath(cleanedFilePath);

    // Ensure that if this file is in a submodule, we remove the submodule dir
    // from the path
    cleanedFilePath = this.removeSubmodulePrefix(cleanedFilePath);

    if (!isFunction(callback)) {
      throw new Error('Must be called with a callback function');
    }

    // Make the async blame call on the git repo
    repoUtil.blame(cleanedFilePath, function (err, blame) {
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
  repoUtilForPath(filePath) {
    const submodules = this.repo.submodules;

    // By default, we return the root GitCommander repository.
    let repoUtil = this.tools.root;

    // if we have submodules, loop through them and see if the given file path
    // belongs inside one of the repositories. If so, we return the GitCommander repo
    // for that submodule.
    if (submodules) {
      each(submodules, (submodulePath) => {
        const submoduleRegex = new RegExp(`^${submodulePath}`);
        if (submoduleRegex.test(filePath)) {
          repoUtil = this.tools[submodulePath];
        }
      });
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
  removeSubmodulePrefix(filePath) {
    let trimmedFilePath = filePath;
    const submodules = this.repo.submodules;
    if (submodules) {
      each(submodules, (submodulePath) => {
        const submoduleRegex = new RegExp(`^${submodulePath}`);
        if (submoduleRegex.test(trimmedFilePath)) {
          trimmedFilePath = filePath.replace(submoduleRegex, '');
        }
      });
    }

    // remove leading '/' if there is one before returning
    return trimmedFilePath.replace(/^\//, '');
  }

}
