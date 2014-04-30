const _ = require('underscore');

function parseRevision(line) {
  var revisionRegex = /^\w+/;
  return line.match(revisionRegex)[0];
}

function parseCommitter(line) {
  var committerMatcher = /^committer\s(.*)$/m;
  return line.match(committerMatcher)[1];
}

function parseDate(line) {
  var dateMatcher = /^committer-time\s(.*)$/m;
  return line.match(dateMatcher)[1];
}

function parseBlameLine(blameData, index) {
  return {
    commit: parseRevision(blameData),
    line: index + 1,
    committer: parseCommitter(blameData),
    date: parseDate(blameData)
  };
}

/**
 * Parses git-blame output into usable array of info objects.
 *
 * @param {string} blameOutput - output from 'git blame --porcelain <file>'
 */
function parseBlameOutput(blameOut) {
  // Matches new lines only when followed by a line with commit hash info that
  // are followed by autor line. This is the 1st and 2nd line of the blame
  // --porcelain output.
  var singleLineDataSplitRegex = /\n(?=\w+\s(?:\d+\s)+\d+\nauthor)/g;

  // Split the blame output into data for each line and parse out desired
  // data from each into an object.
  return blameOut.split(singleLineDataSplitRegex).map(parseBlameLine);
}

// EXPORTS
module.exports = {
  parseBlame: parseBlameOutput
};
