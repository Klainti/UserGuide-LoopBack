/* eslint-disable no-await-in-loop */

'use strict';

class MyTreeStructure {
  constructor(app) {
    this.MarkdownM = app.models.Markdown;
    this.FolderM = app.models.Folder;
  }

  /* Create and save a folder to DB */
  saveFolder(folders) {
    const promiseList = [];
    folders.forEach((folder) => {
      promiseList.push(this.FolderM.upsertWithWhere(
        { name: folder.name, path: folder.path }, folder));
    });
    return Promise.all(promiseList);
  }

  /* Get folders and markdowns for a specific path (DEPTH: 1) */
  getTreeByPath(path) {
    const findMarkdown = this.MarkdownM.find({ where: { path } });
    const findFolder = this.FolderM.find({ where: { path } });
    return Promise.all([findMarkdown, findFolder])
      .then((result) => {
        const descendants = [];
        /* iterate result and push (markdowns, folders) to descendants. */
        result.forEach((markdownOrFolder) => {
          markdownOrFolder.forEach((value) => {
            descendants.push(value);
          });
        });
        return descendants;
      })
  }

  /* Split path to folder's name and folder's path! */
  getFolderFromPath(path) {
    let lenOfPath;
    let folderName;
    let folderPath;
    const list = [];
    const splittedPath = path.split('/');
    while (splittedPath.length) {
      lenOfPath = splittedPath.length;
      folderName = splittedPath[lenOfPath - 1];
      if (folderName === '') {
        break;
      }
      folderPath = `${splittedPath.slice(0, lenOfPath - 1).join('/')}`;
      if (folderPath === '') {
        folderPath = '/';
      }
      list.push({ path: folderPath, name: folderName });
      splittedPath.pop();
    }
    return list;
  }

  /* Check for empty folders and delete them. Returns path of the first non-empty folder! */
  async deleteUp(path) {
    let i = 0;
    let descendantsPath;
    let descendants = [];
    // First get names of folders to check for emptiness
    const folders = this.getFolderFromPath(path);
    while (i < folders.length) { // For each folder!
      if (folders[i].path === '/') { // make path to check for descendants
        descendantsPath = `${folders[i].path}${folders[i].name}`;
      } else {
        descendantsPath = `${folders[i].path}/${folders[i].name}`;
      }
      descendants = await this.getTreeByPath(descendantsPath); // Get descendants
      // there is no descendants = empty folder -> delete this folder!
      if (descendants.length === 0) {
        await this.FolderM.destroyAll({ path: folders[i].path, name: folders[i].name });
      } else { // non-empty folder, return path of descendants!
        return descendantsPath;
      }
      i++;
    }
    return '/'; // All folders till root was empty, return root!
  }
}
module.exports = MyTreeStructure;
