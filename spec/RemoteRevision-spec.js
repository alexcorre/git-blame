var RemoteRevision = require('../lib/util/RemoteRevision');

describe('RemoteRevision', function() {

  var DEFAULT_HASH = '12345';
  var instance;
  var fakeRemoteUrl = 'git@github.com/alexcorre/git-blame.git';

  beforeEach(function () {
    instance = new RemoteRevision(fakeRemoteUrl);
  });

  describe('parseProjectAndRepo', function() {

    beforeEach(function () {
      instance.hash = DEFAULT_HASH;
      instance.remote = null;
    });

    afterEach(function () {
      instance.hash = null;
      instance.remote = fakeRemoteUrl;
    });

    it('Should return an empty object if pattern does not match', function () {
      var weirdRemote = 'NOT_MATCHING';
      instance.remote = weirdRemote;

      var output = instance.parseProjectAndRepo();
      expect(output).toEqual({});
    });


    it('Should parse a standard github url correctly', function () {
      var githubRemote = 'git@github.com:project/someRepo.git';
      instance.remote = githubRemote;

      var output = instance.parseProjectAndRepo();

      expect(output).toEqual({
        project: 'project',
        repo: 'someRepo'
      });
    });

    it('Should parse a standard github url without the .git ending correctly', function () {
      var githubRemote = 'git@github.com:project/someRepo';
      instance.remote = githubRemote;

      var output = instance.parseProjectAndRepo();

      expect(output).toEqual({
        project: 'project',
        repo: 'someRepo'
      });
    });

    it('Should parse a read only github url correctly', function () {
      var githubHttpRemote = 'https://github.com/project/someRepo.git';
      instance.remote = githubHttpRemote;

      var output = instance.parseProjectAndRepo();

      expect(output).toEqual({
        project: 'project',
        repo: 'someRepo'
      });
    });

    it('Should parse a repo url with dashes', function () {
      var githubHttpRemote = 'https://github.com/some-project/some-repo.git';
      instance.remote = githubHttpRemote;

      var output = instance.parseProjectAndRepo();

      expect(output).toEqual({
        project: 'some-project',
        repo: 'some-repo'
      });
    });

    it('Should parse a repo url with dashes and wthout a .git ending correctly', function () {
      var githubHttpRemote = 'https://github.com/some-project/some-repo';
      instance.remote = githubHttpRemote;

      var output = instance.parseProjectAndRepo();

      expect(output).toEqual({
        project: 'some-project',
        repo: 'some-repo'
      });
    });

    it('Should work with a url with a port', function() {
      var portRemoteUrl = 'ssh://git@git.my-company.com:2222/group/repo-name.git';
      instance.remote = portRemoteUrl;

      var output = instance.parseProjectAndRepo();

      expect(output).toEqual({
        project: 'group',
        repo: 'repo-name'
      });
    });

    it('Should work with a url with a port and colon', function() {
      var portRemoteUrl = 'git@git.my-company.com:2222:group/repo-name.git';
      instance.remote = portRemoteUrl;

      var output = instance.parseProjectAndRepo();

      expect(output).toEqual({
        project: 'group',
        repo: 'repo-name'
      });
    });

    it('Should work without a project', function() {
      var repoOnlyUrl = 'git@git.my-company.com:repo-name.git';
      instance.remote = repoOnlyUrl;

      var output = instance.parseProjectAndRepo();

      expect(output).toEqual({
        project: 'repo-name',
        repo: 'repo-name'
      });
    });

    it('Should work when there is a . in the repo name', function() {
      var dotRepoUrl = 'git@github.com:MoOx/moox.github.io.git';
      instance.remote = dotRepoUrl;

      var output = instance.parseProjectAndRepo();

      expect(output).toEqual({
        project: 'MoOx',
        repo: 'moox.github.io'
      });
    });

    it('Should work when there is a . in the project name', function() {
      var dotRepoUrl = 'git@github.com:Mo.Ox/moox.github.io.git';
      instance.remote = dotRepoUrl;

      var output = instance.parseProjectAndRepo();

      expect(output).toEqual({
        project: 'Mo.Ox',
        repo: 'moox.github.io'
      });
    });

  });

});
