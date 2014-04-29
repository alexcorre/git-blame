/**
 * Parses git-blame output into usable array of info objects.
 *
 * @param {string} blameOutput - output from 'git blame --porcelain <file>'
 */
function parseBlame(blameOutput) {
  return blameOutput;
}

// EXPORTS
module.exports = {
  parseBlame: parseBlame
};
