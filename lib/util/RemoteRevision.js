'use babel';

import _ from 'lodash';
import loophole from 'loophole';
import { showError } from '../controllers/errorController';

const GITHUB_TEMPLATE = 'https://github.com/<%- project %>/<%- repo %>/commit/<%- revision %>';
const BITBUCKET_TEMPLATE = 'https://bitbucket.org/<%- project %>/<%- repo %>/commits/<%- revision %>';
const GITLAB_TEMPLATE = 'https://gitlab.com/<%- project %>/<%- repo %>/commit/<%- revision %>';

function safeTemplate(templateString) {
  return loophole.allowUnsafeNewFunction(function () {
    return _.template(templateString);
  });
}

export default class RemoteRevision {

  constructor(remote, gitConfigRepositoryUrl) {
    this.remote = remote;
    this.gitConfigRepositoryUrl = gitConfigRepositoryUrl;
    this.initialize();
  }

  static create(remoteUrl) {
    const rr = new RemoteRevision(remoteUrl);
    if (!rr.getTemplate()) {
      throw new Error('Cannot create RemoteRevision with invalid template');
    }
    return rr;
  }

  initialize() {
    const data = this.parseProjectAndRepo();
    if (data.project && data.repo) {
      this.project = data.project;
      this.repo = data.repo;
    } else {
      // we were unable to parse data from the remote...
      showError('error-problem-parsing-data-from-remote');
    }
  }

  /**
   * Generates a URL for the given revision/commit identifier based on the parsed
   * remote data and the template.
   */
  url(revision) {
    const template = this.getTemplate();
    if (!template) {
      // this should be impossible, so throw
      throw new Error('No template present in RemoteRevision');
    }

    // we were unable to parse upon initialization...so return empty url
    if (!this.project || !this.repo || !revision) {
      return '';
    }

    // create data object used to render template string
    const data = {
      revision: revision,
      project: this.project,
      repo: this.repo,
    };

    // return a rendered url
    return template(data);
  }

  /**
   * Parses project and repo from this.remote.
   *
   * @returns Object containing the project and repo.
   */
  parseProjectAndRepo() {
    // strip off .git if its there
    const strippedRemoteUrl = this.remote.replace(/(\.git)$/, '');

    const pattern = /[:/]([.\w-]*)?\/?([.\w-]*)$/;
    const matches = strippedRemoteUrl.match(pattern);

    // if we have no matches just return empty object. caller should validate
    // data before using it.
    if (!matches) {
      return {};
    }

    // if no project is matched, project and repo are the same.
    return {
      project: matches[1],
      repo: matches[2] || matches[1],
    };
  }

  /**
   * Creates a template function using default GitHub / Bitbucket / GitLab
   * url templates or a custom url template strings specified in the configs.
   */
  getTemplate() {
    if (this.isGitHub()) {
      return safeTemplate(GITHUB_TEMPLATE);
    }

    if (this.isBitbucket()) {
      return safeTemplate(BITBUCKET_TEMPLATE);
    }

    if (this.isGitLab()) {
      return safeTemplate(GITLAB_TEMPLATE);
    }

    if (atom.config.get('git-blame.useCustomUrlTemplateIfStandardRemotesFail')) {
      if (this.gitConfigRepositoryUrl) {
        return safeTemplate(this.gitConfigRepositoryUrl);
      }

      const customUrlTemplate = atom.config.get('git-blame.customCommitUrlTemplateString');

      // if the user hasnt entered a template string, return nothing
      if (/^Example/.test(customUrlTemplate)) {
        return;
      }

      return safeTemplate(customUrlTemplate);
    }
  }

  /**
   * Returns true if this RemoteRevision represents a GitHub repository.
   */
  isGitHub() {
    return /github.com/.test(this.remote);
  }

  /**
   * Returns true if this RemoteRevision represents a Bitbucket repository.
   */
  isBitbucket() {
    return /bitbucket.org/.test(this.remote);
  }

  /**
   * Returns true if this RemoteRevision represents a GitLab repository.
   */
  isGitLab() {
    return /gitlab.com/.test(this.remote);
  }

}
