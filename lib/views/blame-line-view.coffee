{$} = require 'atom-space-pen-views'
React = require 'react-atom-fork'
Reactionary = require 'reactionary-atom-fork'
{div, span, a} = Reactionary
RP = React.PropTypes
moment = require 'moment'
{formatDate} = require '../util/blameFormatter'
errorController = require '../controllers/errorController'
shell = require 'shell'

HASH_LENGTH = 7  # github uses this length
BLANK_HASH = '-'.repeat(HASH_LENGTH)

_defaultDate = null
getDefaultDate = ->
  _defaultDate ?= formatDate moment("2014-01-01T13:37:00 Z")


renderLoading = ->
  div className: 'blame-line loading',
    span className: 'hash', BLANK_HASH
    span className: 'date', getDefaultDate()
    span className: 'committer', 'Loading'

BlameLineComponent = React.createClass
  propTypes:
    date: RP.string.isRequired
    hash: RP.string.isRequired
    remoteRevision: RP.object
    author: RP.string.isRequired
    committer: RP.string.isRequired
    committerDate: RP.string.isRequired
    summary: RP.string.isRequired
    backgroundClass: RP.string
    noCommit: RP.bool
    showOnlyLastNames: RP.bool.isRequired

  render: ->
    if @props.noCommit
      div className: 'blame-line no-commit text-subtle',
        span className: 'hash', BLANK_HASH
        span className: 'date', @props.date
        span className: 'committer', 'Nobody'
    else
      div className: 'blame-line ' + @props.backgroundClass,
        unless @props.remoteRevision
          a onClick: @didClickHashWithoutUrl, className: 'hash', @props.hash.substring(0, HASH_LENGTH)
        else
          url = @props.remoteRevision.url @props.hash
          a href: '#', 'data-url': url, className: 'hash', @props.hash.substring(0, HASH_LENGTH)
        span className: 'date', @props.date
        span className: 'committer text-highlight',
          if @props.showOnlyLastNames
            @props.author.split(' ').slice(-1)[0]
          else
            @props.author

  componentDidMount: ->
    $el = $(@getDOMNode())
    $('a', $el).click @didClickHashWithUrl
    if @props.summary
      atom.tooltips.add($el,
        title: @props.summary
        placement: "auto left"
      )

  didClickHashWithUrl: (e) ->
    e.preventDefault()
    shell.openExternal(e.target.getAttribute('data-url'))

  componentWillUnmount: ->
    $el = $(@getDOMNode())
    $el.tooltip "destroy" if $el.tooltip?

  shouldComponentUpdate: ({hash, showOnlyLastNames}) ->
    hash isnt @props.hash or showOnlyLastNames != @props.showOnlyLastNames

  didClickHashWithoutUrl: (event, element) ->
    errorController.showError 'error-no-custom-url-specified'

module.exports = {BlameLineComponent, renderLoading}
