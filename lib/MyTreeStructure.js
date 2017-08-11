'use strict';

class MyTreeStructure {
  constructor(app) {
    this.MarkdownM = app.models.Markdown;
    this.FolderM = app.models.Folder;
  }
  SaveFolder(Folders) {
    const PromiseList = [];
    Folders.forEach((folder) => {
      PromiseList.push(this.FolderM.upsertWithWhere(
        { name: folder.name, path: folder.path }, folder));
    });
    return Promise.all(PromiseList);
  }
}
module.exports = MyTreeStructure;
