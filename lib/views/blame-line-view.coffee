{$, React, Reactionary} = require 'atom'
RP = React.PropTypes
{div, span, a} = Reactionary
RemoteRevision = require '../util/RemoteRevision'

HASH_LENGTH = 7  # github uses this length
BLANK_HASH = '-'.repeat(HASH_LENGTH)


renderLoading = ->
  div className: 'blame-line loading',
    span className: 'hash', BLANK_HASH
    span className: 'date', '1337-01-01'
    span className: 'committer', 'Loading'


BlameLineComponent = React.createClass
  propTypes:
    date: RP.string.isRequired
    hash: RP.string.isRequired
    url: RP.string.isRequired
    committer: RP.string.isRequired
    backgroundClass: RP.string
    noCommit: RP.bool

  render: ->
    if @props.noCommit
      div className: 'blame-line no-commit text-subtle',
        span className: 'hash', BLANK_HASH
        span className: 'date', @props.date
        span className: 'committer', 'Nobody'
    else
      url = RemoteRevision.create(@props.hash, @props.url).url()
      div className: 'blame-line ' + @props.backgroundClass,
        a className: 'hash', href: url,
          @props.hash.substring(0, HASH_LENGTH)
        span className: 'date', @props.date
        span className: 'committer text-highlight',
          @props.committer.split(' ').slice(-1)[0]

  componentDidMount: ->
    $el = $(@getDOMNode())
    if @props.summary
      $el.setTooltip
        title: @props.summary
        placement: "auto left"

  componentWillUnmount: ->
    $(@getDOMNode()).tooltip "destroy"

  shouldComponentUpdate: ->
    false

module.exports = {BlameLineComponent, renderLoading}
