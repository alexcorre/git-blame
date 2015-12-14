#git-blame

> Toggle git-blame annotations for the current file in the gutter of atom editor.

![screenshot](https://raw.githubusercontent.com/alexcorre/git-blame/master/images/screen-shot.png)

## Usage

### Toggling the gutter

There a few ways to toggle the `git-blame` gutter.

**Right Click**

Right click the file you want to blame. Select `Toggle Git Blame` options from the dropdown.

![right-click-activate](https://raw.githubusercontent.com/alexcorre/git-blame/master/images/right-click-activate.png)

**Keyboard Shortcut**

Show git blame for the currently active editor with the command `ctrl-b`. An editor pane is active if the the cursor is blinking on it.

### Submodules

Submodules? No problem, git-blame should take care of that.

### See the revision diff

Click on the revision hash in the gutter to be taken to the configured repository visual diff. See setting a custom remote repo url section below for support beyond bitbucket and github.

## Options

### Ignore White Space Diffs

If this option is selected, the `git blame` command will be run with `-w` option.

### Show Only Last Names

If this option is selected, only the last word of the author's name will be displayed.

### Date Format String

Default date format is `YYYY-MM-DD`. This feature is backed by [moment.js](http://momentjs.com/). Any formats [supported by moment](http://momentjs.com/docs/#/displaying/format/) are valid here.

### Setting a Custom Remote Repo Url
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
* **0.2.4**: React editor support. Support for repositories that don't specify a project.
* **0.3.0**
  - Resizable width of blame panel
  - git-blame view layer rebuilt in React
  - See commit message tooltip when hovering over a commit
  - git-blame now updates to pick up changes on save
  - support for remote repositories that have "." in project or repo names
* **0.3.1**: [Issue #41](https://github.com/alexcorre/git-blame/issues/41). Option to blame with -w.
* **0.3.2**: [Issue #43](https://github.com/alexcorre/git-blame/issues/43).
* **0.3.3**: Fix gramatical issues in error prompts.
* **0.4.0**: Shadow DOM compatibility, Atom 1.0 fixes
* **0.4.1**: Fix Atom 0.190.0 deprecations
* **0.4.2**: Add support for multi repository projects. Fix issue when blaming empty files.
* **0.4.3**: Remove further deprecations
* **0.4.4**: Fix [#90](https://github.com/alexcorre/git-blame/issues/90)
* **0.4.5**: Fix startup issues and the ability to click on a sha links. Thanks @filipminev
* **0.4.6**: Add option to choose author name format. Thanks @javawizard
* **0.4.7**: Make gutter width adjustable via settings. Thanks @wouterds
* **0.4.8**: Upgrade `pathwatcher` node module to latest
