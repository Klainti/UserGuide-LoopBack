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

  Markdown.remoteMethod('getLink', {
    accepts: [{ arg: 'name', type: 'string' },
      { arg: 'path', type: 'string' },
      { arg: 'text', type: 'string' }],
    returns: { arg: 'link', type: 'string' },
    description: 'Convert markdown\'s path to link',
    http: { path: '/getLink', verb: 'get' }
  });

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

  /* Create folders */
  Markdown.beforeRemote('create', (ctx, modelInstance, next) => {
    if (!PathValidation.test(ctx.req.body.path) && ctx.req.body.path !== '/') {
      const error = new Error('Invalid Path');
      error.status = 400;
      next(error);
    } else if (ctx.req.body.path !== '/') { // create folders!
      const Folders = Markdown.app.FS.getFolderFromPath(ctx.req.body.path);
      Markdown.app.FS.saveFolder(Folders)
        .then(() => {
          next();
        })
        .catch((error) => {
          next(error);
        });
    } else {
      next();
    }
  });
  Markdown.afterRemote('findOne', (ctx, modelInstance, next) => {
    if (modelInstance) {
      next();
    } else {
      ctx.result = {};
      next();
    }
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
      .then((path) => {
        ctx.result = { path };
        next();
      })
      .catch((error) => {
        next(error);
      });
  });
};
