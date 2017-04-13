'use babel';

import { React } from 'react-for-atom';

const HASH_LENGTH = 7;

export default function BlameLine(props) {
  const {
    className,
    hash,
    noCommit,
    date,
    author,
    showOnlyLastNames,
    viewCommitUrl,
  } = props;

  return (
    <div className={'blame-line ' + className}>
      <a href={viewCommitUrl} className="hash">{hash.substring(0, HASH_LENGTH)}</a>
      <span className="date">{date}</span>
      <span className="committer text-highlight">{author}</span>
    </div>
  );
}
