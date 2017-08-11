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
  /* Get folders and markdowns for a specific path */
  getTreeByPath(path) {
    console.log(path);
    return new Promise((resolve, reject) => {
      Promise.all([this.MarkdownM.find({ where: { path } }),
        this.FolderM.find({ where: { path } })])
        .then((result) => {
          const descendants = [];
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
}
module.exports = MyTreeStructure;
