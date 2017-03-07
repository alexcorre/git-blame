'use babel';

export default class BlameGutter {

  constructor(editor) {
    this.editor = editor;
    this.isShown = false;
  }

  toggleVisibility() {
    this.isShown = !this.isShown;
  }

  dispose() {
    
  }

}
