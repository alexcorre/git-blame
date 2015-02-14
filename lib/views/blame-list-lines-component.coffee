{React, Reactionary, $} = require 'atom'
{div} = Reactionary
RP = React.PropTypes
_ = require 'underscore'
{BlameLineComponent, renderLoading} = require './blame-line-view'

# React Component representing a list of git-blame lines. Contained
# within the BlameListView when necessary.
#
BlameListLinesComponent = React.createClass
  propTypes:
    annotations: RP.arrayOf(RP.object)
    loading: RP.bool.isRequired
    dirty: RP.bool.isRequired
    initialLineCount: RP.number.isRequired
    remoteRevision: RP.object.isRequired

  # Renders the loading gutter. Should be shown while blame command
  # line async process is happening, i.e. when @props.loading is true
  renderLoading: ->
    lines = [0...@props.initialLineCount].map renderLoading
    div null, lines

  # Helper that makes background color of BlameLineComponent
  # alternate by commit
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

  # Renders list of BlameLineComponents to show the user useful git-blame data
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

# =============
# Exports
# =============

module.exports = BlameListLinesComponent
