'use strict';

const config = require('../../server/config.json');

const PathValidation = new RegExp(config.PathValidation, 'm');

module.exports = (Markdown) => {
  /* Convert a markdown text to html! */
  Markdown.preview = (data, cb) => {
    Markdown.app.utils.ConvertToHtml(data)
      .then((html) => {
        cb(null, html);
      })
      .catch((error) => {
        cb(error);
      });
  };

  Markdown.remoteMethod('preview', {
    accepts: { arg: 'data', type: 'string' },
    returns: { arg: 'html', type: 'string' },
    description: 'Convert markdown to html',
    http: { path: '/preview', verb: 'get' }
  });

  /* Search for a markdown and convert it to HTML */
  Markdown.getHtml = (id, cb) => {
    Markdown.findOne({ where: { _id: id } })
      .then((result) => {
        if (result !== null) {
          return Markdown.app.utils.ConvertToHtml(result.data);
        }
        const error = new Error('Not Found any markdown by this ID!');
        error.status = 404;
        return Promise.reject(error);
      })
      .then((html) => {
        cb(null, html);
      })
      .catch((error) => {
        cb(error);
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
    } else if (ctx.req.body.path !== '/') {
      Markdown.app.FS.getFolderFromPath(ctx.req.body.path)
        .then((folders) => {
          Markdown.app.FS.saveFolder(folders);
        })
        .then(() => {
          next();
        })
        .catch((error) => {
          next(error);
        });
    } else { // no folders to create --> path === '/'
      next();
    }
  });

  /* Return empty {} if not found any markdown! Not Error 404 */
  Markdown.afterRemote('findOne', (ctx, modelInstance, next) => {
    if (modelInstance) {
      ctx.result = { modelInstance };
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
