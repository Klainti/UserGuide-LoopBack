'use strict';

const config = require('../../server/config.json');

const PathValidation = new RegExp(config.PathValidation, 'm');

module.exports = (Folder) => {
  /* Search a folder by path and get its content */
  Folder.getContent = (path, cb) => {
    if (!PathValidation.test(path) && path !== '/') {
      const error = new Error('Invalid Path');
      error.status = 400;
      cb(error, null);
    } else {
      Folder.app.FS.getTreeByPath(path)
        .then((children) => {
          const list = Folder.app.utils.CreateList(children);
          return (list);
        })
        .then((list) => {
          cb(null, list);
        })
        .catch((error) => {
          cb(error);
        });
    }
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
