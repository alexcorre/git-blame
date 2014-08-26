{React, Reactionary, $} = require 'atom'
{div, span, a} = Reactionary
RP = React.PropTypes
_ = require 'underscore'
{BlameLineComponent, renderLoading} = require './blame-line-view'


BlameListLinesComponent = React.createClass
  propTypes:
    annotations: RP.arrayOf(RP.object)
    loading: RP.bool.isRequired
    filePath: RP.string.isRequired
    lineCount: RP.number.isRequired
    remoteRevision: RP.object.isRequired

  renderLoading: ->
    lines = [0...@props.lineCount].map renderLoading
    div null, lines

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

  renderLoaded: ->
    # clone so it can be modified
    lines = _.clone @props.annotations

    # add url to open diff
    l.remoteRevision = @props.remoteRevision for l in lines
    @_addAlternatingBackgroundColor lines
    div null, lines.map BlameLineComponent

  render: ->
    if @props.loading
      @renderLoading()
    else
      @renderLoaded()

  shouldComponentUpdate: ({loading}) ->
    loading isnt @props.loading


BlameListView = React.createClass
  propTypes:
    projectBlamer: RP.object.isRequired
    remoteRevision: RP.object.isRequired
    filePath: RP.string.isRequired
    lineCount: RP.number.isRequired
    scrollbar: RP.object.isRequired

  getInitialState: ->
    {
      # TODO: get this from the parent component somehow?
      scrollTop: @props.scrollbar.scrollTop()
      # TODO: be intelligent about persisting this so it doesn't reset
      width: 210
      loading: true
      visible: true
    }

  render: ->
    display = if @state.visible then 'inline-block' else 'none'

    body = if @state.error
      div "Sorry, an error occurred."  # TODO: make this better
    else
      div
        className: 'git-blame-scroller'
        div
          className: 'blame-lines'
          style: WebkitTransform: @getTransform()
          BlameListLinesComponent
            annotations: @state.annotations
            loading: @state.loading
            filePath: @props.filePath
            lineCount: @props.lineCount
            remoteRevision: @props.remoteRevision

    div
      className: 'git-blame'
      style: width: @state.width, display: display
      div className: 'git-blame-resize-handle', onMouseDown: @resizeStarted
      body

  getTransform: ->
    {scrollTop} = @state

    # hardware acceleration causes rendering issues on resize, disabled for now
    useHardwareAcceleration = false
    if useHardwareAcceleration
      "translate3d(0px, #{-scrollTop}px, 0px)"
    else
      "translate(0px, #{-scrollTop}px)"

  componentWillMount: ->
    # kick off async request for blame data
    @loadBlame true

  loadBlame: (force) ->
    return if @state.loading and not force

    @setState loading: true
    @props.projectBlamer.blame @props.filePath, (err, data) =>
      if err
        @setState
          loading: false
          error: true
      else
        @setState
          loading: false
          error: false
          annotations: data

  toggle: ->
    @setState visible: !@state.visible

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
