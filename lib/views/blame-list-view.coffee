{ScrollView} = require 'atom'
BlameLineView = require './blame-line-view'

module.exports =
class BlameListView extends ScrollView

  @content: (params) ->
    @div class: 'git-blame', =>
      @div class: 'blame-lines', =>
          for blameLine in params.annotations
            do (blameLine) =>
              @subview 'blame-line-' + blameLine.line, new BlameLineView(blameLine)

