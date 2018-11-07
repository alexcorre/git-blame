# git-blame

> Toggle git-blame annotations in Atom.

[![Travis](https://img.shields.io/travis/alexcorre/git-blame.svg)](https://travis-ci.org/alexcorre/git-blame)
[![apm](https://img.shields.io/apm/v/git-blame.svg)](https://atom.io/packages/git-blame)
[![apm](https://img.shields.io/apm/dm/git-blame.svg)](https://atom.io/packages/git-blame)

![screenshot](/images/screenshot2.png?raw=true)

## Usage

Use `ctrl-b` to activate blame. Alternatively, right click the file you want to blame and select `Toggle Git Blame` from the dropdown.

![right-click-activate](https://raw.githubusercontent.com/alexcorre/git-blame/master/images/right-click-activate.png)

### See the revision diff

Click on the revision hash in the gutter to visit the configured repository diff site. Hosts supported out of the box are:

* [GitHub](https://github.com/)
* [Bitbucket](https://bitbucket.org/)
* [GitLab](https://gitlab.com/)

If the remote repo has a URL we don't recognize, or if there is no remote named
`origin`, the commit hash will be copied to the clipboard.
Custom remotes can be set globally via options. See below.

## Options

### Ignore White Space Diffs

If this option is selected, the `git blame` command will be run with `-w` option.

### Show First Names

If this option is selected, only the first word of the author's name will be displayed. (If both Show First Names and Show Last Names are enabled, the entire author name will be displayed, regardless of whether it contains only two name parts).

### Show Last Names

If this option is selected, only the last word of the author's name will be displayed. (If both Show First Names and Show Last Names are enabled, the entire author name will be displayed, regardless of whether it contains only two name parts).

### Date Format String

Default date format is `YYYY-MM-DD`. This feature is backed by [moment.js](http://momentjs.com/). Any formats [supported by moment](http://momentjs.com/docs/#/displaying/format/) are valid here.

### Color commit authors
If this option is selected, the commit authors will appear with a unique color to make them easily recognisable.

### Custom Remote Repo Url
This plugin will first check to see if your repo is backed by **GitHub**, **Bitbucket**, or **GitLab** so nothing is required if your repo is hosted on one of these.


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

You can also set a custom URL in your git config. If present, it will be used insted of the one in the package settings.
You can add or change it with this command:
```bash
git config --local atom-git-blame.repositoryUrlTemplate "http://my_server/gitweb/?p=<%- repo %>.git;a=commit;h=<%- revision %>"
```

Or by edit your `.git/config` and add an entry like this:
```ini
[atom-git-blame]
	repositoryUrlTemplate = "http://my_server/gitweb/?p=<%- repo %>.git;a=commit;h=<%- revision %>"
```

## Release History

This project uses [standard-version](https://github.com/conventional-changelog/standard-version). Commit messages should use these [conventions](https://github.com/bcoe/conventional-changelog-standard/blob/master/convention.md). `fix`, `feat`, and `perf` commits will show in the [CHANGELOG.md](CHANGELOG.md) generated upon release.
