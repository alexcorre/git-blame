const shell = require('shell');
const _ = require('underscore');
const loophole = require('loophole');

function RemoteRevision(hash, remote) {
  this.hash = hash;
  this.remote = remote;
}

// ================
// Class Methods
// ================

RemoteRevision.create = function(hash, remoteUrl) {
  debugger;
  return new RemoteRevision(hash, remoteUrl);
}

// ================
// Instance Methods
// ================

_.extend(RemoteRevision.prototype, {

  githubTemplate: 'https://github.com/<%- project %>/<%- repo %>/commit/<%- revision %>',

  bitbucketTemplate: 'https://bitbucket.org/<%- project %>/<%- repo %>/commits/<%- revision %>',

  open: function() {
    var url = this.url();
    if (url) {
      console.log('url', url);
      // shell.openExternal(url);
    }
  },

  url: function() {
    var template = this.getTemplate();
    var data = this.parseProjectAndRepo();
    data.revision = this.hash;

    return template(data);
  },

  parseProjectAndRepo: function() {
    var pattern = /\:(.*)\/(.*)\.git/;
    var matches = this.remote.match(pattern);
    return {
      project: matches[1],
      repo: matches[2]
    };
  },

  getTemplate: function() {
    // Use loophole to allow 'new Function' usage without unsafe eval error
    return loophole.allowUnsafeNewFunction(_.bind(function() {

      if (this.isGithub()) {
        return _.template(this.githubTemplate);
      }

      if (this.isBitbucket()) {
        return _.template(this.bitbucketTemplate);
      }

      // read custom template from config and return

      // else show error repo not supported please add custom config here: link

    }, this));
  },

  isGithub: function() {
    return /github.com/.test(this.remote);
  },

  isBitbucket: function() {
    return /bitbucket.org/.test(this.remote);
  }

});


// Exports
module.exports = RemoteRevision;
