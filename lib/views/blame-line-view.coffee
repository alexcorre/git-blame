{View} = require 'atom'
RemoteRevision = require '../util/RemoteRevision'

module.exports =
class BlameLineView extends View

  @HASH_LENGTH: 7  # github uses this length

  @content: (params) ->
    if params.noCommit
      @div class: "blame-line no-commit text-subtle", =>
        @span class: 'hash', '-'.repeat(@HASH_LENGTH)
        @span class: 'date', params.date
        @span class: 'committer', 'Nobody'
    else
      @div class: 'blame-line ' + params.backgroundClass, title: params.summary, =>
        @a 'data-hash': params.hash, class: 'hash', click: 'hashClicked',
           params.hash.substring(0, @HASH_LENGTH)
        @span class: 'date', params.date
        @span class: 'committer text-highlight',
              params.committer.split(' ').slice(-1)[0]


  hashClicked: (event, element) ->
    filePath = atom.workspace.activePaneItem.getPath()
    remoteUrl = atom.project.getRepo()?.getOriginUrl(filePath)
    hash = element.data('hash')

    # create a RemoteRevision from hash/remoteUrl and open it
    RemoteRevision.create(hash, remoteUrl).open()
