'use strict';

module.exports = (Folder) => {
  Folder.afterRemote('findById', (ctx, modelInstance, next) => {
    let ChildrenPath;
    if (modelInstance.path === '/') {
      ChildrenPath = `${modelInstance.path}${modelInstance.name}`;
    } else {
      ChildrenPath = `${modelInstance.path}/${modelInstance.name}`;
    }
    Folder.app.FS.getTreeByPath(ChildrenPath)
      .then((children) => {
        const list = Folder.app.catalog.CreateList(children);
        ctx.result = { list, path: list[0].path };
        next();
      })
      .catch((error) => {
        next(error);
      });
  });
};
