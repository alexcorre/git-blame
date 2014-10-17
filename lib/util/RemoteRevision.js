const shell = require('shell');
const _ = require('underscore');
const loophole = require('loophole');
const errorController = require('../controllers/errorController');

function RemoteRevision(remote) {
  this.remote = remote;
  this.initialize();
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

  /**
   * Default url template for a github.com commit.
   */
  githubTemplate: 'https://github.com/<%- project %>/<%- repo %>/commit/<%- revision %>',

  /**
   * Default url template for a bitbucket.org commit.
   */
  bitbucketTemplate: 'https://bitbucket.org/<%- project %>/<%- repo %>/commits/<%- revision %>',

  /**
   * Should be called after the remote property is set. Parses the remote url
   * for project and repo and stores them as their own properties.
   */
  initialize: function() {
    var data = this.parseProjectAndRepo();
    if (data.project && data.repo) {
      this.project = data.project;
      this.repo = data.repo;
    } else {
      // we were unable to parse data from the remote...
      errorController.showError('error-problem-parsing-data-from-remote');
    }
  },

  /**
   * Generates a URL for the given revision/commit identifier based on the parsed
   * remote data and the template.
   */
  url: function(revision) {
    var template = this.getTemplate();
    if (!template) {
      // this should be impossible, so throw
      throw "No template present in RemoteRevision";
    }

    // we were unable to parse upon initialization...so return empty url
    if (!this.project || !this.repo || !revision) {
      return '';
    }

    // create data object used to render template string
    var data = {
      revision: revision,
      project: this.project,
      repo: this.repo
    };

    // return a rendered url
    return template(data);
  },

  /**
   * Parses project and repo from this.remote.
   *
   * @returns Object containing the project and repo.
   */
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

  /**
   * Creates a template function using either default github / bitbucket
   * url templates or a custom url template strings specified in the configs.
   */
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

  /**
   * Returns true if this RemoteRevision represents a github repository.
   */
  isGithub: function() {
    return /github.com/.test(this.remote);
  },

  /**
   * Returns true if this RemoteRevision represents a bitbucket repository.
   */
  isBitbucket: function() {
    return /bitbucket.org/.test(this.remote);
  }

});


// Exports
module.exports = RemoteRevision;
