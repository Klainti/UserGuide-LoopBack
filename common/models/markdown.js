'use strict';

const showdown = require('showdown');
const config = require('../../server/config.json');

const converter = new showdown.Converter();
const PathValidation = new RegExp(config.PathValidation, 'm');

module.exports = (Markdown) => {
  /* Serve Welcome Page! */
  Markdown.welcomePage = (name, path, cb) => {
    Markdown.findOne({ where: { name, path } })
      .then((result) => {
        const html = converter.makeHtml(result.data);
        cb(null, html);
      })
      .catch((error) => {
        cb(error, null);
      });
  };

  Markdown.remoteMethod('welcomePage', {
    accepts: [{ arg: 'name', type: 'string' },
              { arg: 'path', type: 'string' }],
    returns: { arg: 'html', type: 'string' },
    description: 'Find Welcome Page',
    http: { path: '/welcomePage', verb: 'get' }
  });

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
    description: 'Convert markdown to html',
    http: { path: '/preview', verb: 'get' }
  });

  /* Convert the path of a markdown to link. Return /guide/{id of markdown} */
  Markdown.getLink = (name, path, linkText, cb) => {
    if (!PathValidation.test(path) && path !== '/') {
      cb('Invalid Path', null);
    } else {
      Markdown.findOne({ where: { name, path } })
        .then((result) => {
          const link = `[${linkText}](/guide/${result.id})`;
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
      { arg: 'linkText', type: 'string' }],
    returns: { arg: 'link', type: 'string' },
    description: "Convert markdown's path to link",
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
          const list = Markdown.app.catalog.CreateList(result[1]);
          ctx.result = { list };
          next();
        }
      });
  });
};
