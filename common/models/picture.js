'use strict';

const request = require('request-promise');

module.exports = (Picture) => {
  /* Download image from given url */
  Picture.download = (url, name) => {
    const image = new Promise((resolve, reject) => {
      request(url, { encoding: 'binary' }) // download image
        .then((data) => {
          const buffer = Buffer.from(data, 'binary');
          return Picture.create({ data: buffer, name }); // save it to db!
        })
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
    return (image);
  };

  Picture.remoteMethod('download', {
    accepts: [{ arg: 'url', type: 'string' },
              { arg: 'name', type: 'string' }],
    description: 'Download image from given url',
    http: { path: '/download', verb: 'post' }
  });
  /* Convert base64 image to binary! */
  Picture.beforeRemote('create', (ctx, modelInstance, next) => {
    const base64 = ctx.req.body.data.substring(ctx.req.body.data.indexOf(','));
    const type = ctx.req.body.data.substring(ctx.req.body.data.indexOf(':') + 1, ctx.req.body.data.indexOf(';'));
    const data = Buffer.from(base64, 'base64').toString('binary');
    ctx.req.body.data = Buffer.from(data, 'binary');
    ctx.req.body.type = type;
    next();
  });

  /* Add content type to an image (png/image)! */
  Picture.afterRemote('findById', (ctx, modelInstance) => {
    ctx.res.setHeader('content-type', modelInstance.type);
    ctx.res.end(modelInstance.data);
  });
};
