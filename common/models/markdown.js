'use strict';

const config = require('../../server/config.json');

const PathValidation = new RegExp(config.PathValidation, 'm');

module.exports = (Markdown) => {
  /* Convert a markdown text to html! */
  Markdown.preview = (data, cb) => {
    const result = Markdown.app.utils.ConvertToHtml(data);
    if (result[0] === null) {
      cb(null, result[1]);
    } else {
      cb(result[0], null);
    }
  };

  Markdown.remoteMethod('preview', {
    accepts: { arg: 'data', type: 'string' },
    returns: { arg: 'html', type: 'string' },
    description: 'Convert markdown to html',
    http: { path: '/preview', verb: 'get' }
  });

  /* Convert the path of a markdown to link. Return /guide/{id of markdown} */
  Markdown.getLink = (name, path, text, cb) => {
    if (!PathValidation.test(path) && path !== '/') {
      cb('Invalid Path', null);
    } else {
      Markdown.findOne({ where: { name, path } })
        .then((result) => {
          const link = `[${text}](/guide/${result.id})`;
          cb(null, link);
        })
        .catch((error) => {
          cb(error, null);
        });
    }
  };

  /* Search for a markdown and convert it to HTML */
  Markdown.getHtml = (id, cb) => {
    Markdown.findOne({ where: { _id: id } })
      .then((result) => {
        const html = Markdown.app.utils.ConvertToHtml(result.data);
        if (html[0] === null) {
          cb(null, html[1]);
        } else {
          cb(html[0], null);
        }
      })
      .catch((error) => {
        cb(error, null);
      });
  };

  Markdown.remoteMethod('getHtml', {
    accepts: [{ arg: 'id', type: 'string' }],
    returns: { arg: 'html', type: 'string' },
    description: 'Get HTML by {id}',
    http: { path: '/:id/preview', verb: 'get' }
  });

  Markdown.remoteMethod('getLink', {
    accepts: [{ arg: 'name', type: 'string' },
      { arg: 'path', type: 'string' },
      { arg: 'text', type: 'string' }],
    returns: { arg: 'link', type: 'string' },
    description: 'Convert markdown\'s path to link',
    http: { path: '/getLink', verb: 'get' }
  });

  /* Create folders */
  Markdown.beforeRemote('upsertWithWhere', (ctx, modelInstance, next) => {
    if (!PathValidation.test(ctx.req.body.path) && ctx.req.body.path !== '/') {
      next('Invalid Path');
    } else {
      if (ctx.req.body.path !== '/') {
        const Folders = Markdown.app.FS.getFolderFromPath(ctx.req.body.path);
        Markdown.app.FS.saveFolder(Folders)
          .catch((error) => {
            next(error);
          });
      }
      next();
    }
  });

  /* Get siblings of the new markdown for Catalog! */
  Markdown.afterRemote('upsertWithWhere', (ctx, modelInstance, next) => {
    Markdown.app.FS.getTreeByPath(modelInstance.path)
      .then((siblings) => {
        const list = Markdown.app.utils.CreateList(siblings);
        ctx.result = { list, newFile: modelInstance.id, path: modelInstance.path };
        next();
      })
      .catch((error) => {
        next(error);
      });
  });

  /* Change markdown's path! */
  Markdown.beforeRemote('prototype.patchAttributes', (ctx, modelInstance, next) => {
    if (!PathValidation.test(ctx.req.body.path) && ctx.req.body.path !== '/') {
      next('Invalid Path');
    } else {
      if (ctx.req.body.path !== '/') {
        const Folders = Markdown.app.FS.getFolderFromPath(ctx.req.body.path);
        Markdown.app.FS.saveFolder(Folders)
          .catch((error) => {
            next(error);
          });
      }
      ctx.oldPath = ctx.req.body.oldPath; // Pass old path to afterRemote and delete it from body!
      delete ctx.req.body.oldPath;
      next();
    }
  });

  /* Check for empty folders in old path! */
  Markdown.afterRemote('prototype.patchAttributes', (ctx, modelInstance, next) => {
    Markdown.app.FS.deleteUp(ctx.oldPath)
      .then((result) => {
        if (result[0] !== null) {
          throw result[0];
        }
        return Markdown.app.FS.getTreeByPath(modelInstance.path);
      })
      .then((siblings) => { // change path -> new catalog view!
        const list = Markdown.app.utils.CreateList(siblings);
        ctx.result = { list, newFile: modelInstance.id, path: modelInstance.path };
        next();
      })
      .catch((error) => {
        next(error);
      });
  });


  /* Get path from requested id */
  Markdown.beforeRemote('deleteById', (ctx, modelInstance, next) => {
    Markdown.findOne({ where: { _id: ctx.req.params.id } })
      .then((result) => {
        ctx.DeleteUpPath = result.path; // pass the path to afterRemote!
        next();
      })
      .catch((error) => {
        next(error);
      });
  });

  /* Search and delete empty folders! */
  Markdown.afterRemote('deleteById', (ctx, modelInstance, next) => {
    Markdown.app.FS.deleteUp(ctx.DeleteUpPath)
      .then((result) => {
        if (result[0] !== null) {
          next(result[0]);
        } else {
          const list = Markdown.app.utils.CreateList(result[1]);
          ctx.result = { list, path: result[2] };
          console.log(result[1]);
          next();
        }
      });
  });
};
