{React, Reactionary, $} = require 'atom'
{div, span, a} = Reactionary
_ = require('underscore')
BlameLineComponent = require './blame-line-view'


BlameListLinesComponent = React.createClass
  # makes background color alternate by commit
  _addAlternatingBackgroundColor: (lines) ->
    bgClass = null
    lastHash = null
    for line in lines
      bgClass = if line.noCommit
        ''
      else if line.hash is lastHash
        bgClass
      else if bgClass is 'line-bg-lighter'
        'line-bg-darker'
      else
        'line-bg-lighter'
      line['backgroundClass'] = bgClass
      lastHash = line.hash
    lines

  render: ->
    # clone so it can be modified
    lines = _.clone @props.annotations

    # add url to open diff
    filePath = atom.workspace.activePaneItem.getPath()
    remoteUrl = atom.project.getRepo()?.getOriginUrl(filePath)
    l['url'] = remoteUrl for l in lines

    @_addAlternatingBackgroundColor lines

    div null, lines.map BlameLineComponent

  shouldComponentUpdate: ->
    false


BlameListView = React.createClass
  getInitialState: ->
    {
      # TODO: get this from the parent component somehow?
      scrollTop: @props.scrollbar.scrollTop()
      # TODO: be intelligent about persisting this so it doesn't reset
      width: 210
    }

  render: ->
    div
      className: 'git-blame'
      style: width: @state.width,
      div className: 'git-blame-resize-handle', onMouseDown: @resizeStarted
      div className: 'git-blame-scroller',
        div
          className: 'blame-lines'
          style: WebkitTransform: @getTransform()
          BlameListLinesComponent annotations: @props.annotations

  getTransform: ->
    {scrollTop} = @state

    # hardware acceleration causes rendering issues on resize, disabled for now
    useHardwareAcceleration = false
    if useHardwareAcceleration
      "translate3d(0px, #{-scrollTop}px, 0px)"
    else
      "translate(0px, #{-scrollTop}px)"

  componentDidMount: ->
    # Bind to scroll event on vertical-scrollbar to sync up scroll position of
    # blame gutter.
    @props.scrollbar.on 'scroll', @matchScrollPosition

  componentWillUnmount: ->
    @props.scrollbar.off 'scroll', @matchScrollPosition

  # Makes the view arguments scroll position match the target elements scroll
  # position
  matchScrollPosition: ->
    @setState scrollTop: @props.scrollbar.scrollTop()

  resizeStarted: ({pageX}) ->
    @setState dragging: true, initialPageX: pageX, initialWidth: @state.width
    $(document).on 'mousemove', @onResizeMouseMove
    $(document).on 'mouseup', @resizeStopped

  resizeStopped: (e) ->
    $(document).off 'mousemove', @onResizeMouseMove
    $(document).off 'mouseup', @resizeStopped
    @setState dragging: false

    e.stopPropagation()
    e.preventDefault()

  onResizeMouseMove: (e) ->
    return @resizeStopped() unless @state.dragging and e.which is 1
    @setState width: @state.initialWidth + e.pageX - @state.initialPageX

    e.stopPropagation()
    e.preventDefault()

module.exports = BlameListView
