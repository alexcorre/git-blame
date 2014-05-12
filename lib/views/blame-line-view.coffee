{View} = require 'atom'

module.exports =
class BlameLineView extends View

  @content: (params) ->
    if params.noCommit
      @div class: 'blame-line no-commit', =>
        @span class: 'text-subtle', '----------'
    else
      @div class: 'blame-line ' + params.backgroundClass, =>
        @a 'data-hash': params.hash, class: 'hash', click: 'hashClicked', params.hash.substring(0,8)
        @span class: 'date', params.date
        @span class: 'committer text-highlight', params.committer.split(' ').slice(-1)[0]


  hashClicked: (event, element) ->
    console.log(element.data('hash'));
