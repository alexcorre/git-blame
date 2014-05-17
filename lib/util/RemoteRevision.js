const shell = require('shell');
const _ = require('underscore');
const loophole = require('loophole');

const errorController = require('../controllers/errorController');

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
      shell.openExternal(url);
    }
  },

  url: function() {
    var template = this.getTemplate();

    if (!template) {
      errorController.showError('error-no-custom-url-specified');
      return;
    }

    // create data object used to render template string
    var data = this.parseProjectAndRepo();
    data.revision = this.hash;

    // return a rendered url
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
    if (this.isGithub()) {
      return this.safeTemplate(this.githubTemplate);
    }

    if (this.isBitbucket()) {
      return this.safeTemplate(this.bitbucketTemplate);
    }

    if (atom.config.get('git-blame.useCustomUrlTemplateIfStandardRemotesFail')) {
      var customUrlTemplate = atom.config.get('git-blame.customCommitUrlTemplateString');

      // if the user hasnt entered a template string...inform them
      if (/^Example/.test(customUrlTemplate)) {
        // TODO inform user
        errorController.showError('error-no-custom-url-specified');
        return;
      }

      return this.safeTemplate(customUrlTemplate);
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
