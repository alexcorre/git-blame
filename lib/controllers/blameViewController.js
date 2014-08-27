const $ = require('atom').$;
const React = require('atom').React;
const BlameListView = require('../views/blame-list-view');


/**
 * Display or hide a BlameListView for the active editor.
 *
 * If the active editor does not have an existing BlameListView, one will be
 * mounted.
 *
 * @param {Blamer} projectBlamer - a Blamer for the current project
 */
function toggleBlame(projectBlamer) {
  var editorView = atom.workspaceView.getActiveView();
  var editor = editorView.getEditor();

  if (!editorView.blameView) {
    // insert the BlameListView after the gutter div
    var mountPoint = $('<div>', {'class': 'git-blame-mount'});
    editorView.find('.gutter').after(mountPoint);

    editorView.blameView = React.renderComponent(new BlameListView({
      projectBlamer: projectBlamer,
      filePath: editor.getPath(),
      lineCount: editor.getLineCount(),
      scrollbar: editorView.find('.vertical-scrollbar')
    }), mountPoint[0]);
  } else {
    editorView.blameView.toggle();
  }
}


// EXPORTS
module.exports = {
  toggleBlame: toggleBlame
};
