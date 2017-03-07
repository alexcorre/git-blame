'use babel';

import repositoryForEditorPath from './repositoryForEditorPath';

export default class BlameGutter {

  constructor(editor) {
    this.editor = editor;
    this.isShown = false;
  }

  toggleVisibility() {
    return this.setVisibility(!this.isShown);
  }

  /**
   * Set the visibility
   * @returns {Promise<boolean>}
   */
  setVisibility(visible) {
    // if we're trying to set the visiblity to the value it already has
    // just resolve and do nothing.
    if (this.isShown === visible) {
      return Promise.resolve(visible);
    }

    // grab filePath from editor
    const { editor } = this;
    const filePath = editor.isEmpty() ? null : editor.getPath();
    if (!filePath) {
      return Promise.reject(new Error('No filePath could be determined for editor.'));
    }

    return repositoryForEditorPath(filePath)
      .then(repo => {
        this.isShown = visible;
        return this.isShown;
      });
  }

  dispose() {

  }

}
