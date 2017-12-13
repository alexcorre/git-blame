'use babel';

export default {
  useCustomUrlTemplateIfStandardRemotesFail: {
    type: 'boolean',
    default: false,
  },
  customCommitUrlTemplateString: {
    type: 'string',
    default: 'Example -> https://github.com/<%- project %>/<%- repo %>/commit/<%- revision %>',
  },
  columnWidth: {
    type: 'integer',
    default: 210,
  },
  dateFormatString: {
    type: 'string',
    default: 'YYYY-MM-DD',
  },
  ignoreWhiteSpaceDiffs: {
    type: 'boolean',
    default: false,
  },
  showOnlyLastNames: {
    type: 'boolean',
    default: false,
  },
  showHash: {
    type: 'boolean',
    default: true,
  },
  colorCommit: {
    type: 'string',
    default: 'NONE',
    enum: [
      {value: 'NONE', description: 'No Color'},
      {value: 'author', description: 'Assign color for each Author'},
      {value: 'hash', description: 'Assign color for each commit'}
    ]
  }
};
