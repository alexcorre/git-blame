{View} = require 'atom'

module.exports =
class BlameLineView extends View

  @content: (params) ->
    @div class: 'blame-line', =>
      @span class: 'commit', params.hash.substring(0,8)
      @span class: 'date', params.date
      @span class: 'committer', params.committer