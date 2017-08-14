'use strict';

const showdown = require('showdown');
const config = require('../../server/config.json');

const converter = new showdown.Converter();
const PathValidation = new RegExp(config.PathValidation, 'm');

module.exports = (Markdown) => {
  /* Convert a markdown text to html! */
  Markdown.preview = (data, cb) => {
    try {
      const html = converter.makeHtml(data);
      cb(null, html);
    } catch (err) {
      cb(err, null);
    }
  };

  Markdown.remoteMethod('preview', {
    accepts: { arg: 'data', type: 'string' },
    returns: { arg: 'html', type: 'string' },
    http: { path: '/preview', verb: 'get' }
  });

  /* Create folders */
  Markdown.beforeRemote('upsertWithWhere', (ctx, modelInstance, next) => {
    if (!PathValidation.test(ctx.req.body.path) && ctx.req.body.path !== '/') {
      next('Invalid Path');
    } else {
      if (ctx.req.body.path !== '/') {
        const SplittedPath = ctx.req.body.path.split('/');
        let LenOfPath = SplittedPath.length;
        const Folders = [];
        while (LenOfPath !== 1) { /* Split path to take folders! */
          const name = SplittedPath[LenOfPath - 1];
          let path = SplittedPath.slice(0, LenOfPath - 1).join('/');
          if (path === '') {
            path = '/';
          }
          Folders.push({ name, path });
          LenOfPath--;
        }
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
        const list = Markdown.app.catalog.CreateList(siblings);
        ctx.result = { list, newFile: modelInstance.id, path: modelInstance.path };
        next();
      })
      .catch((error) => {
        next(error);
      });
  });

  /* Get path from requested id. */
  Markdown.beforeRemote('deleteById', (ctx, modelInstance, next) => {
    Markdown.findOne({ where: { _id: ctx.req.params.id } })
      .then((result) => {
        ctx.DeleteUpPath = result.path; //pass the path to afterRemote!
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
          const list = Markdown.app.catalog.CreateList(result[1]);
          ctx.result = { list };
          next();
        }
      });
  });
};
