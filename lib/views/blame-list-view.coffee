{React, Reactionary, $} = require 'atom'
{div} = Reactionary
RP = React.PropTypes
_ = require 'underscore'
BlameListLinesComponent = require './blame-list-lines-component'

# Main container component for the git-blame gutter. Handles bound
# Editor events to keep the blame gutter in sync. 
#
BlameListView = React.createClass
  propTypes:
    projectBlamer: RP.object.isRequired
    remoteRevision: RP.object.isRequired
    editorView: RP.object.isRequired

  # an array of event binding Disposable objects used for unbinding
  eventBindingDisposables: []

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
    preparedAnnotations = @prepareAnnotationsForCurrentEditorState @state.annotations

    body = if @state.error
      div "Sorry, an error occurred."  # TODO: make this better
    else
      div
        className: 'git-blame-scroller'
        div
          className: 'blame-lines'
          style: WebkitTransform: @getTransform()
          BlameListLinesComponent
            annotations: preparedAnnotations
            loading: @state.loading
            dirty: @state.dirty
            initialLineCount: preparedAnnotations.length
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

  # Modifies the blame data for the current editor state, taking
  # folds into account.
  # TODO: Handle soft wraps here as well
  prepareAnnotationsForCurrentEditorState: (annotations) ->
    return [] unless annotations

    filteredLineData = []
    highestScreenRowSeen = 0
    e = @editor()

    # loop through the blame data and filter out the blame line rows
    # for lines that are not visible on the screen due to folded code
    # TODO: Handle soft wraps here.
    for lineData, index in annotations
      screenRow = e.screenPositionForBufferPosition([index, 0]).row
      if screenRow == index or screenRow > highestScreenRowSeen
        filteredLineData.push lineData
        highestScreenRowSeen = screenRow

    return filteredLineData

  # bound callback for Editor 'contents-modified' event
  contentsModified: ->
    return unless @isMounted()
    @setState dirty: true unless @state.dirty

  # bound callback for Editor.buffer 'saved' event
  saved: ->
    return unless @isMounted()
    @loadBlame() if @state.visible and @state.dirty

  # bound callback for Editor 'screen-lines-changed' event. This happens quite
  # often while editing, so we calla debounced method to force a re-render with
  # current data. This is the only way to know when code is folded / unfolded,
  # but its also called whenever new lines are added / while editing.
  onScreenLinesChanged: (e) ->
    return unless @isMounted()
    @forceUpdate()
    # @matchScrollPosition()

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

  componentWillMount: ->
    # kick off async request for blame data
    @loadBlame()

    # bind to published events
    @eventBindingDisposables.push @editor().onDidStopChanging(@contentsModified)
    @eventBindingDisposables.push @editor().buffer.onDidSave(@saved)

    # bind to internal events
    @editor().on 'screen-lines-changed', @onScreenLinesChanged

  componentWillUnmount: ->
    # unbind published events
    for disposable in @eventBindingDisposables
      disposable.dispose()

    # unbind internal events
    @editor().off 'screen-lines-changed', @onScreenLinesChanged
    @scrollbar().off 'scroll', @matchScrollPosition

  # Matches scroll position of the BlameListView with the scroll bar. Bit
  # of a hack since blame scrolls separately from the buffer right now
  matchScrollPosition: ->
    @setState scrollTop: @scrollbar().scrollTop()

  # ==========
  # Resize
  # ==========

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

# ==========
# Exports
# ==========

module.exports = BlameListView
