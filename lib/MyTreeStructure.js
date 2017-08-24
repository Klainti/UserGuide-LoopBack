/* eslint-disable no-await-in-loop */

'use strict';

class MyTreeStructure {
  constructor(app) {
    this.MarkdownM = app.models.Markdown;
    this.FolderM = app.models.Folder;
  }

  /* Create and save a folder to DB */
  saveFolder(Folders) {
    const PromiseList = [];
    Folders.forEach((folder) => {
      PromiseList.push(this.FolderM.upsertWithWhere(
        { name: folder.name, path: folder.path }, folder));
    });
    return Promise.all(PromiseList);
  }

  /* Get folders and markdowns for a specific path (DEPTH: 1) */
  getTreeByPath(path) {
    return new Promise((resolve, reject) => {
      Promise.all([this.MarkdownM.find({ where: { path } }),
        this.FolderM.find({ where: { path } })])
        .then((result) => {
          const descendants = [];
          /* iterate result and push (markdowns, folders) to descendants. */
          result.forEach((MarkdownOrFolder) => {
            MarkdownOrFolder.forEach((value) => {
              descendants.push(value);
            });
          });
          resolve(descendants);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /* Split path to folder's name and folder's path! */
  getFolderFromPath(path) {
    let LenOfPath;
    let FolderName;
    let FolderPath;
    const list = [];
    const SplittedPath = path.split('/');
    while (SplittedPath.length) {
      LenOfPath = SplittedPath.length;
      FolderName = SplittedPath[LenOfPath - 1];
      if (FolderName === '') {
        break;
      }
      FolderPath = `${SplittedPath.slice(0, LenOfPath - 1).join('/')}`;
      if (FolderPath === '') {
        FolderPath = '/';
      }
      list.push({ path: FolderPath, name: FolderName });
      SplittedPath.pop();
    }
    return Promise.resolve(list);
  }

  /* Check for empty folders and delete them. Returns path of the first non-empty folder! */
  async deleteUp(path) {
    let i = 0;
    let descendantsPath;
    let descendants = [];
    // First get names of folders to check for emptiness
    const Folders = await this.getFolderFromPath(path);
    while (i < Folders.length) { // For each folder!
      if (Folders[i].path === '/') { // make path to check for descendants
        descendantsPath = `${Folders[i].path}${Folders[i].name}`;
      } else {
        descendantsPath = `${Folders[i].path}/${Folders[i].name}`;
      }
      descendants = await this.getTreeByPath(descendantsPath); // Get descendants
      // there is no descendants = empty folder -> delete this folder!
      if (descendants.length === 0) {
        await this.FolderM.destroyAll({ path: Folders[i].path, name: Folders[i].name });
      } else { // non-empty folder, return path of descendants!
        return descendantsPath;
      }
      i++;
    }
    return '/'; // All folders till root was empty, return root!
  }
}
module.exports = MyTreeStructure;
