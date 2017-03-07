'use babel';

import { Directory } from 'pathwatcher';
import path from 'path';
import { CompositeDisposable } from 'atom';

import config from './config';
import Blamer from './util/blamer';
import BlameViewController from './controllers/blameViewController';
import errorController from './controllers/errorController';

// reference to the Blamer instance created in initializeContext if this
// project is backed by a git repository.
var projectBlamers = {}

function toggle() {
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


/**
 * Main Package Module
 */
export default {

  config,

  subscriptions: null,

  activate() {
    this.subscriptions = new CompositeDisposable();

    // register commands
    const commands = {
      'git-blame:toggle': toggle,
    };
    this.subscriptions.add(atom.commands.add('atom-workspace', commands));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

};
