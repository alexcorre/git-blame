{View} = require 'atom'

module.exports =
class BlameLineView extends View

  @content: (params) ->
    if /^0*$/.test(params.hash)
      @div class: 'blame-line no-commit', =>
        @span class: 'text-subtle', '----------'
    else
      @div class: 'blame-line', =>
        @span class: 'hash', params.hash.substring(0,8)
        @span class: 'date', params.date
        @span class: 'committer text-highlight', params.committer.split(' ').slice(-1)[0]