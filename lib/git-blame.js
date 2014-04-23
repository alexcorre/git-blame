function activate() {
  console.log('activate');

  // Register git-blame:blame
  atom.workspaceView.command('git-blame:blame', function() {
    return blame();
  });

  return;
}

function blame() {
  var editor = atom.workspace.activePaneItem;
  var selection = editor.getSelection();

  return console.log('BLAMING');
}

module.exports = {
  blame: blame,
  activate: activate
};
