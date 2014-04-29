const _ = require('underscore');

// Constants
const OUTPUT_PER_LINE = 12;

function parseRevision(line) {
  return line;
}

function parseLineNumber(line) {
  return line;
}

function parseCommitter(line) {
  return line;
}

function parseDate(line) {
  return line;
}

function parseBlameLine(lineData) {
  return {
    commit: parseRevision(lineData[0]),
    line: parseLineNumber(lineData[0]),
    committer: parseCommitter(lineData[5]),
    date: parseDate(lineData[7])
  };
}

/**
 * Parses git-blame output into usable array of info objects.
 *
 * @param {string} blameOutput - output from 'git blame --porcelain <file>'
 */
function parseBlameOutput(blameOut) {
  var lineData = _.groupBy(blameOut.split('\n'), function(line, index) {
    return Math.floor(index/OUTPUT_PER_LINE);
  });

  return _.values(lineData).map(parseBlameLine);
}

// EXPORTS
module.exports = {
  parseBlame: parseBlameOutput
};
