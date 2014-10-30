const $ = require('atom').$;
const React = require('atom').React;
const BlameListView = require('../views/blame-list-view');
const RemoteRevision = require('../util/RemoteRevision');
const errorController = require('./errorController');


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
  var filePath = editor.getPath();

  if (!editorView.blameView) {
    var remoteUrl = projectBlamer.repo.getOriginUrl(filePath);
    var remoteRevision;
    try {
      remoteRevision = RemoteRevision.create(remoteUrl);
    } catch (e) {
      // the only exception possible occurs when the template string is invalid
      // TODO refactor this to not throw an exception
    }

    // insert the BlameListView after the gutter div
    var mountPoint = $('<div>', {'class': 'git-blame-mount'});
    editorView.find('.gutter').after(mountPoint);

    editorView.blameView = React.renderComponent(new BlameListView({
      projectBlamer: projectBlamer,
      remoteRevision: remoteRevision,
      editorView: editorView
    }), mountPoint[0]);
  } else {
    editorView.blameView.toggle();
  }
}


// EXPORTS
module.exports = {
  toggleBlame: toggleBlame
};
