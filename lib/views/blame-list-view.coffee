{ScrollView} = require 'atom'
BlameLineView = require './blame-line-view'

module.exports =
class BlameListView extends ScrollView

  @content: (params) ->
    @div class: 'git-blame', =>
      @div class: 'blame-lines', =>
          for blameLine in params.annotations
            blameLine.backgroundClass = @lineClass blameLine
            do (blameLine) =>
              @subview 'blame-line-' + blameLine.line, new BlameLineView(blameLine)

  @lastHash: ''

  @lastBgClass: ''

  @lineClass: (lineData) ->
    if lineData.noCommit
      return ''

    if lineData.hash isnt @lastHash
      @lastHash = lineData.hash
      @lastBgClass = if @lastBgClass == 'line-bg-lighter' then 'line-bg-darker' else 'line-bg-lighter'

    return @lastBgClass
