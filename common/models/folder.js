'use strict';

module.exports = (Folder) => {
  /* Search a folder by path and get its content */
  Folder.getContent = (path, cb) => {
    Folder.app.FS.getTreeByPath(path)
      .then((children) => {
        cb(null, children);
      })
      .catch((error) => {
        cb(error, null);
      });
  };

  Folder.remoteMethod('getContent', {
    accepts: { arg: 'path', type: 'string' },
    returns: { arg: 'list', type: 'string' },
    description: 'Get content of a folder',
    http: { path: '/getContent', verb: 'get' }
  });

  /* Search a folder by id and get its content. */
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
