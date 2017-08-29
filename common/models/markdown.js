'use strict';


module.exports = (Markdown) => {
  /* Convert a markdown text to html! */
  Markdown.preview = data => Promise.resolve(Markdown.app.utils.convertToHtml(data));

  Markdown.remoteMethod('preview', {
    accepts: { arg: 'data', type: 'string' },
    returns: { arg: 'html', type: 'string' },
    description: 'Convert markdown to html',
    http: { path: '/preview', verb: 'get' }
  });

  /* Search for a markdown and convert it to HTML */
  Markdown.getHtml = id => Markdown.findOne({ where: { _id: id } })
    .then((result) => {
      if (result === null) {
        const error = new Error('Not Found any markdown by this ID!');
        error.status = 404;
        return error;
      }
      return Markdown.app.utils.convertToHtml(result.data);
    });

  Markdown.remoteMethod('getHtml', {
    accepts: { arg: 'id', type: 'string' },
    returns: { arg: 'html', type: 'string' },
    description: 'Get HTML by {id}',
    http: { path: '/:id/preview', verb: 'get' }
  });

  /* Create folders */
  Markdown.beforeRemote('create', (ctx, modelInstance, next) => {
    Markdown.app.utils.validPath(ctx.req.body.path)
      .then((error) => {
        if (error) throw error;
        if (ctx.req.body.path === '/') { // not need to take folders, is root!
          return null;
        }
        return Markdown.app.FS.getFolderFromPath(ctx.req.body.path);
      })
      .then((folders) => {
        if (folders) {
          return Markdown.app.FS.saveFolder(folders);
        }
        return null; // no need to save folders, is root!
      })
      .then(() => {
        next();
      })
      .catch((error) => {
        next(error);
      });
  });

  /* Return empty {} if not found any markdown! Not Error 404 */
  Markdown.afterRemote('findOne', (ctx, modelInstance, next) => {
    if (modelInstance) {
      ctx.result = { modelInstance };
    } else {
      ctx.result = {};
    }
    next();
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
