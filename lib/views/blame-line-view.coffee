{View} = require 'atom'

module.exports =
class BlameLineView extends View

  @content: (params) ->
    @div class: 'line-number', =>
      @span params.commit.substring(0,6) + ' ' + params.committer