const shell = require('shell');
const _ = require('underscore');
const loophole = require('loophole');

const errorController = require('../controllers/errorController');

function RemoteRevision(remote) {
  this.remote = remote;
}

// ================
// Class Methods
// ================

RemoteRevision.create = function(remoteUrl) {
  var rr = new RemoteRevision(remoteUrl);
  if (!rr.getTemplate()) {
    throw "Cannot create RemoteRevision with invalid template";
  }
  return rr;
};

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

  url: function(revision) {
    var template = this.getTemplate();
    if (!template) {
      // this should be impossible, so throw
      throw "No template present in RemoteRevision";
    }

    // create data object used to render template string
    var data = this.parseProjectAndRepo();
    data.revision = revision;

    // ensure we have all the correct vars in the template data
    if (!this.verifyTemplateData(data)) {
      // TODO: validate this upon creation
      errorController.showError('error-problem-parsing-data-from-remote');
      return;
    }

    // return a rendered url
    return template(data);
  },

  verifyTemplateData: function(data) {
    return !!(data.project && data.repo && data.revision);
  },

  parseProjectAndRepo: function() {
    // strip off .git if its there
    var strippedRemoteUrl = this.remote.replace(/(\.git)$/, "");

    var pattern = /[\:\/]([.\w-]*)?\/?([.\w-]*)$/;
    var matches = strippedRemoteUrl.match(pattern);

    // if we have no matches just return empty object. caller should validate
    // data before using it.
    if (!matches) {
      return {};
    }

    // if no project is matched, project and repo are the same.
    return {
      project: matches[1],
      repo: matches[2] || matches[1]
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

      // if the user hasnt entered a template string, return nothing
      if (/^Example/.test(customUrlTemplate)) {
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
