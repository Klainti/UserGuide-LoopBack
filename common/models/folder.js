'use strict';


module.exports = (Folder) => {
  /* Search a folder by path and get its content */
  Folder.getContent = (path) => {
    const content = new Promise((resolve, reject) => {
      Folder.app.utils.ValidPath(path)
        .then(() => {
          const children = Folder.app.FS.getTreeByPath(path);
          return (children);
        })
        .then((children) => {
          const list = Folder.app.utils.CreateList(children);
          return (list);
        })
        .then((list) => {
          resolve(list);
        })
        .catch((error) => {
          reject(error);
        });
    });
    return (content);
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
        const list = Folder.app.utils.CreateList(children);
        return (list);
      })
      .then((list) => {
        ctx.result = { list, path: list[0].path };
        next();
      })
      .catch((error) => {
        next(error);
      });
  });
};
