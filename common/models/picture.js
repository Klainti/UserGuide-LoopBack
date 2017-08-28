'use strict';

const request = require('request-promise');

module.exports = (Picture) => {
  /* Download image from given url */
  Picture.download = (url, name) => request(url, { encoding: 'binary' }) // download image
      .then(data => Picture.create({ data: Buffer.from(data, 'binary'), name }))
      .then(modelInstance => modelInstance.id);

  Picture.remoteMethod('download', {
    accepts: [{ arg: 'url', type: 'string' },
              { arg: 'name', type: 'string' }],
    returns: { arg: 'id', type: 'string' },
    description: 'Download image from given url',
    http: { path: '/download', verb: 'post' }
  });
  /* Convert base64 image to binary! */
  Picture.beforeRemote('create', (ctx, modelInstance, next) => {
    const base64 = ctx.req.body.data.substring(ctx.req.body.data.indexOf(','));
    const data = Buffer.from(base64, 'base64').toString('binary');
    ctx.req.body.data = Buffer.from(data, 'binary');
    next();
  });

  /* Add content type to an image (png/image)! */
  Picture.afterRemote('findById', (ctx, modelInstance) => {
    ctx.res.setHeader('content-type', 'image/*');
    ctx.res.end(modelInstance.data);
  });
};
