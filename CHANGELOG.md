# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.7.0"></a>
# [1.7.0](https://github.com/alexcorre/git-blame/compare/v1.6.1...v1.7.0) (2018-06-07)


### Bug Fixes

* **config:** Git Binary -> Git Binary Path for clarity ([c28e3b6](https://github.com/alexcorre/git-blame/commit/c28e3b6))


### Features

* **git:** add support for custom gitBinary path (#227) ([595d057](https://github.com/alexcorre/git-blame/commit/595d057))



<a name="1.6.1"></a>
## [1.6.1](https://github.com/alexcorre/git-blame/compare/v1.6.0...v1.6.1) (2018-06-07)


### Bug Fixes

* remove [@workpop](https://github.com/workpop)/simple-logger dependency with broken build artifact (#231) ([c8c9cbd](https://github.com/alexcorre/git-blame/commit/c8c9cbd))



<a name="1.6.0"></a>
# [1.6.0](https://github.com/alexcorre/git-blame/compare/v1.5.1...v1.6.0) (2018-02-23)


### Features

* **copy:** when no template is found for the repo, copy the hash to the clipboard and notify on click (#226) ([e7897be](https://github.com/alexcorre/git-blame/commit/e7897be))



<a name="1.5.1"></a>
## [1.5.1](https://github.com/alexcorre/git-blame/compare/v1.5.0...v1.5.1) (2018-02-23)


### Bug Fixes

* **blamer:** fix the non-working blame functionality for certain files (#219) ([cbef3ab](https://github.com/alexcorre/git-blame/commit/cbef3ab)), closes [#219](https://github.com/alexcorre/git-blame/issues/219)



<a name="1.5.0"></a>
# [1.5.0](https://github.com/alexcorre/git-blame/compare/v1.4.0...v1.5.0) (2018-01-25)


### Bug Fixes

* **config:** change .gitconfig entry keypath to atom-git-blame.repositoryUrlTemplate ([98ccf82](https://github.com/alexcorre/git-blame/commit/98ccf82))


### Features

* **config:** set custom repository URL in git config file (#222) ([264405d](https://github.com/alexcorre/git-blame/commit/264405d)), closes [#125](https://github.com/alexcorre/git-blame/issues/125)



<a name="1.4.0"></a>
# [1.4.0](https://github.com/alexcorre/git-blame/compare/v1.3.1...v1.4.0) (2017-12-11)


### Bug Fixes

* **ux:** default color commit authors to false ([60aeb01](https://github.com/alexcorre/git-blame/commit/60aeb01))
* **ux:** text overflow in gutter (#216) ([0237c96](https://github.com/alexcorre/git-blame/commit/0237c96))
* **ux:** tweak color styles. lint. ([efcb9af](https://github.com/alexcorre/git-blame/commit/efcb9af))


### Features

* **errors:** use atom build in error notier. remove legacy space pen custom view ([91274ab](https://github.com/alexcorre/git-blame/commit/91274ab))
* **ux:** color commit authors (#205) ([3236257](https://github.com/alexcorre/git-blame/commit/3236257))



<a name="1.3.1"></a>
## [1.3.1](https://github.com/alexcorre/git-blame/compare/v1.3.0...v1.3.1) (2017-09-24)


### Bug Fixes

* **syntax:** fix syntax error preventing package activation (#208) ([5537244](https://github.com/alexcorre/git-blame/commit/5537244)), closes [#208](https://github.com/alexcorre/git-blame/issues/208)



<a name="1.3.0"></a>
# [1.3.0](https://github.com/alexcorre/git-blame/compare/v1.2.2...v1.3.0) (2017-09-24)


### Features

* **gitlab:** Add GitLab to default repo sources (#207) ([5079a47](https://github.com/alexcorre/git-blame/commit/5079a47)), closes [#183](https://github.com/alexcorre/git-blame/issues/183)



<a name="1.2.2"></a>
## [1.2.2](https://github.com/alexcorre/git-blame/compare/v1.2.1...v1.2.2) (2017-08-24)


### Bug Fixes

* **tooltip:** tooltips remaining after hiding the gutter (#204) ([3bcdb1e](https://github.com/alexcorre/git-blame/commit/3bcdb1e))



<a name="1.2.1"></a>
## [1.2.1](https://github.com/alexcorre/git-blame/compare/v1.2.0...v1.2.1) (2017-08-09)


### Bug Fixes

* **gutter:** gutter resize jump issue (#201) ([7fabe30](https://github.com/alexcorre/git-blame/commit/7fabe30))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/alexcorre/git-blame/compare/v1.1.1...v1.2.0) (2017-08-02)


### Features

* **gutter:** Added an option to not show the hash in the gutter (#189) ([ee8b80c](https://github.com/alexcorre/git-blame/commit/ee8b80c))



<a name="1.1.1"></a>
## [1.1.1](https://github.com/alexcorre/git-blame/compare/v1.1.0...v1.1.1) (2017-05-18)


### Bug Fixes

* **deps:** remove unused dependency pathwatcher (#187) ([23b75bf](https://github.com/alexcorre/git-blame/commit/23b75bf))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/alexcorre/git-blame/compare/v1.0.2...v1.1.0) (2017-05-18)


### Bug Fixes

* **options:** respect showOnlyLastNames option when set ([108c4d0](https://github.com/alexcorre/git-blame/commit/108c4d0))
* **syntax:** use const instead of let ([8082d7a](https://github.com/alexcorre/git-blame/commit/8082d7a))


### Features

* **display:** default option showOnlyLastNames to false instead of true ([b0489a0](https://github.com/alexcorre/git-blame/commit/b0489a0))



<a name="1.0.2"></a>
## [1.0.2](https://github.com/alexcorre/git-blame/compare/v1.0.1...v1.0.2) (2017-05-16)


### Bug Fixes

* **import:** Update index.js to correct import for Blamer (#180) ([6344de4](https://github.com/alexcorre/git-blame/commit/6344de4)), closes [#175](https://github.com/alexcorre/git-blame/issues/175)
* **readme:** Fix broken Markdown headings (#177) ([2708686](https://github.com/alexcorre/git-blame/commit/2708686)), closes [#177](https://github.com/alexcorre/git-blame/issues/177)
* **remotes:** Fix for repos with non-known remotes (#178) ([59de02e](https://github.com/alexcorre/git-blame/commit/59de02e)), closes [#178](https://github.com/alexcorre/git-blame/issues/178)



<a name="1.0.1"></a>
## [1.0.1](https://github.com/alexcorre/git-blame/compare/v1.0.0...v1.0.1) (2017-04-13)


### Bug Fixes

* **deps:** add lodash dependency (#173) ([cd6ccf6](https://github.com/alexcorre/git-blame/commit/cd6ccf6))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/alexcorre/git-blame/compare/v0.4.12...v1.0.0) (2017-04-13)


### Bug Fixes

* **deps:** upgrade pathwatcher ([44f8a5d](https://github.com/alexcorre/git-blame/commit/44f8a5d))


### Features

* **rewrite:** convert coffeescript to es6 + rewrite with new atom gutter apis (#171) ([4513896](https://github.com/alexcorre/git-blame/commit/4513896))
* **yarn:** use yarn ([1116f5e](https://github.com/alexcorre/git-blame/commit/1116f5e))



# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.
