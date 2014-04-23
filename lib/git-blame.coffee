GitBlameView = require './git-blame-view'

module.exports =
  gitBlameView: null

  activate: (state) ->
    @gitBlameView = new GitBlameView(state.gitBlameViewState)

  deactivate: ->
    @gitBlameView.destroy()

  serialize: ->
    gitBlameViewState: @gitBlameView.serialize()
