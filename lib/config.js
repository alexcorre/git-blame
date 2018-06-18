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
  gitBinaryPath: {
    type: 'string',
    default: 'git',
  },
  ignoreWhiteSpaceDiffs: {
    type: 'boolean',
    default: false,
  },
  showFirstNames: {
    type: 'boolean',
    default: true,
  },
  showLastNames: {
    type: 'boolean',
    default: true,
  },
  showHash: {
    type: 'boolean',
    default: true,
  },
  colorCommitAuthors: {
    type: 'boolean',
    default: false,
  },
};
