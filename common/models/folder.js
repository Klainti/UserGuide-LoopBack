'use strict';


module.exports = (Folder) => {
  /* Search a folder by path and get its content */
  Folder.getContent = path => Folder.app.utils.validPath(path)
    .then((error) => {
      if (error) throw error;
      return Folder.app.FS.getTreeByPath(path);
    })
    .then(children => Folder.app.utils.createList(children));

  Folder.remoteMethod('getContent', {
    accepts: { arg: 'path', type: 'string' },
    returns: { arg: 'list', type: 'array' },
    description: 'Get content of a folder',
    http: { path: '/getContent', verb: 'get' }
  });
};
