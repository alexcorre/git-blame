{View} = require 'atom'

module.exports =
class BlameErrorView extends View

  @content: (params) ->
    @div class: 'overlay from-top', =>
      @div class: 'block text-highlight', 'Git Blame Error:'
      @div class: 'error-message block', params.message
      @div class: 'block', =>
        @button class: 'btn', click: 'onOk', 'Ok'

  onOk: (event, element) =>
    this.remove();

  attach: ->
    atom.workspaceView.append(this);

