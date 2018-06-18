'use babel';

import React from 'react';
import strings from '../locales/strings';

const HASH_LENGTH = 7;
const colours = {};

function word(str, index) {
  const words = str.split(' ');
  return words[index < 0 ? words.length + index : index];
}

function stringToColour(str) {
  if (colours[str]) {
    return colours[str];
  }

  let hash = 0;
  for (let i = 0; i < str.length; i++) {              // eslint-disable-line no-plusplus
    hash = str.charCodeAt(i) + ((hash << 5) - hash);  // eslint-disable-line no-bitwise
  }
  let colour = '#';
  for (let i = 0; i < 3; i++) {                       // eslint-disable-line no-plusplus
    var value = (hash >> (i * 8)) & 0xFF;             // eslint-disable-line no-bitwise
    colour += (`00${value.toString(16)}`).substr(-2);
  }
  colours[str] = colour;
  return colour;
}

function copyText(str) {
  atom.clipboard.write(str);
  const messageString = strings.copiedToClipboard;
  const notif = atom.notifications.addSuccess(messageString, {
    dismissable: true,
  });
  const timeout = setTimeout(() => { notif.dismiss(); }, 3000);
  notif.onDidDismiss(() => {
    if (timeout) {
      clearTimeout(timeout);
    }
  });
}

export default function BlameLine(props) {
  const {
    className,
    hash,
    date,
    author,
    showFirstNames,
    showLastNames,
    showHash,
    viewCommitUrl,
    colorCommitAuthors,
    copyHashOnClick,
  } = props;
  const onClick = copyHashOnClick ?
    () => { return copyText(hash); } :
    null;
  let displayName = '';
  if (showFirstNames && showLastNames) {
    displayName = author;
  } else if (showFirstNames) {
    displayName = word(author, 0);
  } else {
    displayName = word(author, -1);
  }

  return (
    <div className={`blame-line ${className}`} style={{ borderRight: colorCommitAuthors ? `2px solid ${stringToColour(author)}` : 'none' }}>
      <a href={viewCommitUrl} onClick={onClick}>
        {showHash ? <span className="hash">{hash.substring(0, HASH_LENGTH)}</span> : null}
        <span className="date">{date}</span>
        <span className="committer text-highlight">{displayName}</span>
      </a>
    </div>
  );
}
