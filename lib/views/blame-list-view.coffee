{$} = require 'atom-space-pen-views'
React = require 'react-atom-fork'
Reactionary = require 'reactionary-atom-fork'
{div} = Reactionary
RP = React.PropTypes
_ = require 'underscore'
{BlameLineComponent, renderLoading} = require './blame-line-view'


BlameListLinesComponent = React.createClass
  propTypes:
    annotations: RP.arrayOf(RP.object)
    loading: RP.bool.isRequired
    dirty: RP.bool.isRequired
    initialLineCount: RP.number.isRequired
    remoteRevision: RP.object.isRequired

  renderLoading: ->
    lines = [0...@props.initialLineCount].map renderLoading
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

  shouldComponentUpdate: ({loading, dirty}) ->
    finishedInitialLoad = @props.loading and not loading and not @props.dirty
    finishedEdit = @props.dirty and not dirty
    finishedInitialLoad or finishedEdit

BlameListView = React.createClass
  propTypes:
    projectBlamer: RP.object.isRequired
    remoteRevision: RP.object.isRequired
    editorView: RP.object.isRequired

  getInitialState: ->
    {
      # TODO: get this from the parent component somehow?
      scrollTop: @scrollbar().scrollTop()
      # TODO: be intelligent about persisting this so it doesn't reset
      width: 210
      loading: true
      visible: true
      dirty: false
    }

  scrollbar: ->
    @_scrollbar ?= @props.editorView.find('.vertical-scrollbar')

  editor: ->
    @_editor ?= @props.editorView.getModel()

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
            dirty: @state.dirty
            initialLineCount: @editor().getLineCount()
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
    @loadBlame()
    @editor().onDidStopChanging @contentsModified
    @editor().onDidSave @saved

  loadBlame: ->
    @setState loading: true
    @props.projectBlamer.blame @editor().getPath(), (err, data) =>
      if err
        @setState
          loading: false
          error: true
          dirty: false
      else
        @setState
          loading: false
          error: false
          dirty: false
          annotations: data

  contentsModified: ->
    return unless @isMounted()
    @setState dirty: true unless @state.dirty

  saved: ->
    return unless @isMounted()
    @loadBlame() if @state.visible and @state.dirty

  toggle: ->
    if @state.visible
      @setState visible: false
    else
      @loadBlame() if @state.dirty
      @setState visible: true

  componentDidMount: ->
    # Bind to scroll event on vertical-scrollbar to sync up scroll position of
    # blame gutter.
    @scrollbar().on 'scroll', @matchScrollPosition

  componentWillUnmount: ->
    @scrollbar().off 'scroll', @matchScrollPosition
    @editor().off 'contents-modified', @contentsModified
    @editor().buffer.off 'saved', @saved

  # Makes the view arguments scroll position match the target elements scroll
  # position
  matchScrollPosition: ->
    @setState scrollTop: @scrollbar().scrollTop()

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
