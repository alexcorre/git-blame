/**
 * For now we just have some string key -> value mappings in english. i18n
 * support to come later.
 */

 module.exports = {
   // Strings
   'git-blame-error': 'Git Blame Error:',

   // ERROR Messages
   'error-no-custom-url-specified': 'Woops! It looks like you didnt enter a Custom Commit Url Template String in the package settings. Please do so in order to open commit hashes for repos that are not hosted on Github or Bitbucket.',
   'error-file-path-not-checked-in': 'Looks like this file is not yet checked in, so we cant find any blame info to show you.',
   'error-problem-parsing-data-from-remote': 'Looks like we were unable to get the project and repo name from your remote url. It may have a format we havent seen before. Please file an issue!',
   'error-not-backed-by-git': 'We\'ve got nothing to show you. This project doesnt appear to be backed by git.'
 };
