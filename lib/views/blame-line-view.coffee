{$, React, Reactionary} = require 'atom'
{div, span, a} = Reactionary
RemoteRevision = require '../util/RemoteRevision'

HASH_LENGTH = 7  # github uses this length

module.exports =
BlameLineComponent = React.createClass
  render: ->
    if @props.noCommit
      div className: 'blame-line no-commit text-subtle',
        span className: 'hash', '-'.repeat(HASH_LENGTH)
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
