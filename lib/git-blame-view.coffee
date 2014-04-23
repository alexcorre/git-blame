{View} = require 'atom'

module.exports =
class GitBlameView extends View
  @content: ->
    @div class: 'git-blame overlay from-top', =>
      @div "The GitBlame package is Alive! It's ALIVE!", class: "message"

  initialize: (serializeState) ->
    atom.workspaceView.command "git-blame:toggle", => @toggle()

  # Returns an object that can be retrieved when package is activated
  serialize: ->

  # Tear down any state and detach
  destroy: ->
    @detach()

  toggle: ->
    console.log "GitBlameView was toggled!"
    if @hasParent()
      @detach()
    else
      atom.workspaceView.append(this)
