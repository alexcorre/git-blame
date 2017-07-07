'use babel';

import { React } from 'react-for-atom';

const HASH_LENGTH = 7;

function lastWord(str) {
  const words = str.split(' ');
  return words[words.length - 1];
}

export default function BlameLine(props) {
  const {
    className,
    hash,
    noCommit,
    date,
    author,
    showOnlyLastNames,
    showHash,
    viewCommitUrl,
  } = props;

  const displayName = showOnlyLastNames ? lastWord(author) : author;
  return (
    <div className={'blame-line ' + className}>
      <a href={viewCommitUrl}>
        {showHash ? <span className="hash">{hash.substring(0, HASH_LENGTH)}</span> : null}
        <span className="date">{date}</span>
        <span className="committer text-highlight">{displayName}</span>
      </a>
    </div>
  );
}
