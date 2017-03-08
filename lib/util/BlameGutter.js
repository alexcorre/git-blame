'use babel';

import { Range } from 'atom';
import repositoryForEditorPath from './repositoryForEditorPath';

const GUTTER_ID = 'com.alexcorre.git-blame';

export default class BlameGutter {

  constructor(editor) {
    this.editor = editor;
    this.isShown = false;
    this.lineDecorations = [];
  }

  /**
   * Top level API for toggling gutter visiblity + blaming the currently
   * open file, if any.
   */
  toggleVisibility() {
    return this.setVisibility(!this.isShown);
  }

  /**
   * Set the visibility of the gutter. Bootstraps a new gutter if need be.
   *
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

    if (visible) {
      // we are showing the gutter
      this.gutter().show();
      this.updateLineMarkers();
    } else {
      this.removeLineMarkers();
      this.gutter().hide();
    }

    this.isShown = visible;
    return Promise.resolve(this.isShown);

    // return repositoryForEditorPath(filePath)
    //   .then(repo => {
    //
    //   })
    //   .then(() => {
    //     this.isShown = visible;
    //     return this.isShown;
    //   });
  }

  /**
   * Lazily generate a Gutter instance for the current editor, the first time
   * we need it. Any other accesses will grab the same gutter reference until
   * the Gutter is explicitly disposed.
   */
  gutter() {
    const { editor } = this;
    const gutter = editor.gutterWithName(GUTTER_ID);
    return gutter ? gutter : editor.addGutter({
      name: GUTTER_ID,
      visible: false,
    });
  }

  updateLineMarkers() {
    // adding one marker to the first line
    const singleLineRange = new Range([0, 0], [0, 0]);
    const lineMarker = this.editor.markBufferRange(singleLineRange);

    const node = this.generateLineElement();
    const decoration = this.gutter().decorateMarker(lineMarker, {
      class: 'blame-line',
      item: node,
    });

    this.lineDecorations.push(decoration);
  }

  removeLineMarkers() {
    this.lineDecorations.forEach(decoration => { decoration.destroy(); });
  }

  generateLineElement() {
    const newDiv = document.createElement("div");
    const newContent = document.createTextNode("blaming this line");
    newDiv.appendChild(newContent); //add the text node to the newly created div.
    return newDiv;
  }

  dispose() {
    gutter().destroy();
  }

}
