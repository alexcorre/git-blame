{View} = require 'atom'

module.exports =
class BlameLineView extends View

  @content: (params) ->
    @div class: 'blame-line', =>
      @span class: 'hash', params.hash.substring(0,8)
      @span class: 'date', params.date
      @span class: 'committer text-highlight', params.committer.split(' ').slice(-1)[0]