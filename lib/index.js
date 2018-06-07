'use babel';

import { CompositeDisposable } from 'atom';

import config from './config';
import BlameGutter from './util/BlameGutter';

/**
 * Main Package Module
 */
export default {

  config,

  disposables: null,
  gutters: null,

  activate() {
    this.gutters = new Map();
    this.disposables = new CompositeDisposable();
    this.disposables.add(atom.commands.add('atom-workspace', {
      'git-blame:toggle': this.toggle.bind(this),
    }));
  },

  deactivate() {
    this.disposables.dispose();
    this.gutters.clear();
  },

  toggle() {
    const editor = atom.workspace.getActiveTextEditor();

    // if there is no active text editor, git-blame can do nothing
    if (!editor) {
      return;
    }

    // get a BlameGutter from the cache or create a new one and add
    // it to the cache.
    let gutter = this.gutters.get(editor);
    if (!gutter) {
      gutter = new BlameGutter(editor);
      this.disposables.add(gutter);
      this.gutters.set(editor, gutter);
    }

    // toggle visiblity of the active gutter
    gutter.toggleVisibility()
      .catch((e) => {
        console.error(e); // eslint-disable-line no-console
      });
  },

};
