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

    if (!template) {
      // TODO tell user of error here. please create custom template this is not a github repo.
      return;
    }

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

  safeTemplate: function(templateString) {
    return loophole.allowUnsafeNewFunction(function() {
      return _.template(templateString);
    });
  },

  getTemplate: function() {
    // read custom template from config and return
    if (this.isGithub()) {
      return this.safeTemplate(this.githubTemplate);
    }

    if (this.isBitbucket()) {
      return this.safeTemplate(this.bitbucketTemplate);
    }
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
