'use babel';

import React from 'react';

const HASH_LENGTH = 7;
const colours = {};

function lastWord(str) {
  const words = str.split(' ');
  return words[words.length - 1];
}

function stringToColour(str) {
  if(colours[str]) {
    return colours[str];
  }

  var hash = 0;
  for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
  }
  colours[str] = colour;
  return colour;

}

export default function BlameLine(props) {
  const {
    className,
    hash,
    date,
    author,
    showOnlyLastNames,
    showHash,
    viewCommitUrl,
    colorCommitAuthors,
  } = props;

  const displayName = showOnlyLastNames ? lastWord(author) : author;
  return (
    <div className={`blame-line ${className}`} style={{ borderRight: colorCommitAuthors ? `2px solid ${stringToColour(author)}` : 'none' }}>
      <a href={viewCommitUrl}>
        {showHash ? <span className="hash">{hash.substring(0, HASH_LENGTH)}</span> : null}
        <span className="date">{date}</span>
        <span className="committer text-highlight">{displayName}</span>
      </a>
    </div>
  );
}
