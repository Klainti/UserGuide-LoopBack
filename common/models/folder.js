'use strict';


module.exports = (Folder) => {
  /* Search a folder by path and get its content */
  Folder.getContent = path => Folder.app.utils.validPath(path)
      .then(() => Folder.app.FS.getTreeByPath(path))
      .then(children => Folder.app.utils.createList(children));

  Folder.remoteMethod('getContent', {
    accepts: { arg: 'path', type: 'string' },
    returns: { arg: 'list', type: 'string' },
    description: 'Get content of a folder',
    http: { path: '/getContent', verb: 'get' }
  });
};
