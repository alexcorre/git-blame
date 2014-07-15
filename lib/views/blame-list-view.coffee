{$, ScrollView} = require 'atom'
BlameLineView = require './blame-line-view'

module.exports =
class BlameListView extends ScrollView

  @content: (params) ->
    @div class: 'git-blame', =>
      @div class: 'git-blame-resize-handle'
      @div class: 'git-blame-scroller', outlet: 'scroller', =>
        @div class: 'blame-lines', =>
          for blameLine in params.annotations
            blameLine.backgroundClass = @lineClass blameLine
            do (blameLine) =>
              @subview 'blame-line-' + blameLine.line, new BlameLineView(blameLine)

  afterAttach: ->
    @on 'mousedown', '.git-blame-resize-handle', @resizeStarted

  @lastHash: ''

  @lastBgClass: ''

  @lineClass: (lineData) ->
    if lineData.noCommit
      return ''

    if lineData.hash isnt @lastHash
      @lastHash = lineData.hash
      @lastBgClass = if @lastBgClass == 'line-bg-lighter' then 'line-bg-darker' else 'line-bg-lighter'

    return @lastBgClass

  resizeStarted: ({pageX}) =>
    @initialPageX = pageX
    @initialWidth = @width()
    $(document).on 'mousemove', @resizeBlameListView
    $(document).on 'mouseup', @resizeStopped

  resizeStopped: =>
    $(document).off 'mousemove', @resizeBlameListView
    $(document).off 'mouseup', @resizeStopped

  resizeBlameListView: ({pageX, which}) =>
    return @resizeStopped() unless which is 1
    @width(@initialWidth + pageX - @initialPageX)

  # Used to sync up editor scrolling with the blame view.
  # This is passed down to the scroller because we don't want to scroll the
  # resizing markup.
  scrollTop: (value) =>
    @scroller.scrollTop value
