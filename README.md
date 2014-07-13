#git-blame

> Toggle git-blame annotations for the current file in the gutter of atom editor.

![screenshot](https://raw.githubusercontent.com/alexcorre/git-blame/master/images/screen-shot.png)

## Usage

Show git blame for the current editor with the command `ctrl-b`. Only works when `.editor` is active. Submodules? No problem. Click on the revision to be taken to the commit page on Github, Bitbucket, or your remote repository url of choice.

## Setting a Custom Remote Repo Url
This plugin will first check to see if your repo is backed by **Github** or **Bitbucket** so nothing is required if your repo is hosted on one of these.

If its not, you can easily set a custom revision URL string like so:
- From the settings view go to settings for this package *Git Blame*
- Check the box for "Use Custom Url Template If Standard Remotes Fail"
- Set your url format string in the box labeled Custom Commit Url String

![url-settings](https://raw.githubusercontent.com/alexcorre/git-blame/master/images/url-settings.png)

The URL string should contain the following three placeholder variables wrapped in underscore template delimiters like so: `<%- variable %>`.
- `project` - Will be replaced with the name of the project in your remote git repository. For this repo it would be `alexcorre`.
- `repo` - Will be replaced with the name of the repository. For this repo it would be `git-blame`.
- `revision` - Will be replaced with the full git revision hash you clicked on.

I'll use github as an example. Its already supported out of the box, but if it wasn't its custom url string would be:

```
https://github.com/<%- project %>/<%- repo %>/commit/<%- revision %>
```
So when you clicked on hash revision 12345 in this git-blame repository, you would visit the following url:

```
https://github.com/alexcorre/git-blame/commit/12345
```

## Release History

* **0.2.0**: Initial Release
* **0.2.1**
  - Fix [Issue #1](https://github.com/alexcorre/git-blame/issues/1). Remote URL parsing.
  - Added RemoteRevision unit tests
* **0.2.2**: [Pull #6](https://github.com/alexcorre/git-blame/pull/6). Remote URL parsing without .git.
* **0.2.3**: [Issue #5](https://github.com/alexcorre/git-blame/issues/5). Fix multiple gutters. Better error handling.
* **0.2.4**: React editor support. Support for repsitories that dont specify a project.
