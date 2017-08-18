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

  /* Get folders and markdowns for a specific path (DEPTH: 1)*/
  getTreeByPath(path) {
    return new Promise((resolve, reject) => {
      Promise.all([this.MarkdownM.find({ where: { path } }),
        this.FolderM.find({ where: { path } })])
        .then((result) => {
          const descendants = [];
          result.forEach((MarkdownOrFolder) => { //iterate result and push (markdowns, folders) to descendants.
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
    let LenOfPath, FolderName, FolderPath;
    let list = [];
    let SplittedPath = path.split('/');
    while (SplittedPath.length) {
      LenOfPath = SplittedPath.length;
      FolderName = SplittedPath[LenOfPath - 1];
      if (FolderName === ''){
        break;
      }
      FolderPath = `${SplittedPath.slice(0, LenOfPath - 1).join('/')}`;
      if (FolderPath === ''){
        FolderPath = '/';
      }
      list.push({ path: FolderPath, name: FolderName});
      SplittedPath.pop();
    }
    return (list);
  }

  /* Check for empty folders and delete them. Returns descendants of the first non-empty folder! */
  async deleteUp(path) {
    let i=0;
    let descendants = [], descendantsPath;
    const Folders = this.getFolderFromPath(path);
    while (i < Folders.length){
      if (Folders[i].path === '/') {
        descendantsPath = `${Folders[i].path}${Folders[i].name}`;
      } else {
        descendantsPath = `${Folders[i].path}/${Folders[i].name}`;
      }
      await this.getTreeByPath(descendantsPath) // get descendants
        .then((result) => {
          descendants = result;
        })
        .catch((error) => {
          return Promise.reject(error);
        });
      if (descendants.length === 0) { // there is no descendants = empty folder -> delete folder!
        await this.FolderM.destroyAll({ path: Folders[i].path, name: Folders[i].name })
          .catch((error) => {
            return Promise.reject(error);
          });
      } else { //non-empty folder, return content of folder!
        return Promise.resolve(descendants[0].path);
      }
      i++;
    }
    await this.getTreeByPath('/') // All folders till root was empty, return content of root!
      .then((result) => {
        descendants = result;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
    return Promise.resolve('/');
  }
}
module.exports = MyTreeStructure;
