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
            blameLine.committerClass = @committerHighlightClass blameLine
            do (blameLine) =>
              @subview 'blame-line-' + blameLine.line, new BlameLineView(blameLine)

  afterAttach: ->
    @on 'mousedown', '.git-blame-resize-handle', @resizeStarted

  @lastHash: ''

  @lastLineAccent: 'light'

  @lineClass: (lineData) ->
    lineClass = if @lightOrDark(lineData) == 'light' then 'line-bg-darker' else 'line-bg-lighter'
    return lineClass

  @committerHighlightClass: (lineData) ->
    highlightClass = if @lightOrDark(lineData) == 'light' then 'variable' else ''
    return highlightClass

  @lightOrDark: (lineData) ->
    if lineData.noCommit
      return ''

    if lineData.hash isnt @lastHash
      @lastHash = lineData.hash
      @lastLineAccent = if @lastLineAccent == 'light' then 'dark' else 'light'

    return @lastLineAccent

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
