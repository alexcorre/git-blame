'use babel';

import { Directory } from 'atom';

/**
 * Given a pathString for a file in an active TextEditor
 *
 * @param  {String} pathString
 * @return {Promise<GitRepository>}
 */
export default function repositoryForEditorPath(pathString) {
  const directory = new Directory(pathString);

  return atom.project.repositoryForDirectory(directory)
    .then((projectRepo) => {
      if (!projectRepo) {
        throw new Error(`Unable to find GitRepository for path ${pathString}.`);
      }

      return projectRepo;
    });
}
