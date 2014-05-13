const shell = require('shell');

function RemoteRevision(hash, remoteUrl) {
  this.hash = hash;
  this.remote = remoteUrl;
}

RemoteRevision.create = function(hash, remoteUrl) {
  return new RemoteRevision(hash, remoteUrl);
}

RemoteRevision.prototype.open = function() {
  var url = this.url();
  shell.openExternal(url);
}

RemoteRevision.prototype.url = function() {
  if (this.isGithub()) {
    return this.githubUrl();
  }
}

RemoteRevision.prototype.isGithub = function() {
  return /github.com/.test(this.remote);
}

RemoteRevision.prototype.githubUrl = function() {
  var base = 'https://github.com/';
  var matches = this.remote.match(/github.com\:(.*)\/(.*)\.git/)
  var userName = matches[1];
  var repoName = matches[2];

  return base + userName + '/' + repoName + '/commit/' + this.hash;
}


// Exports
module.exports = RemoteRevision;
