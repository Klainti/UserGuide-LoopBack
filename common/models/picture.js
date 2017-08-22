'use strict';

const request = require('request-promise');

module.exports = (Picture) => {
  /* Download image from given url */
  Picture.beforeRemote('create', (ctx, unused, next) => {
    request(ctx.req.body.url, { encoding: 'binary' })
      .then((data) => {
        ctx.req.body.data = new Buffer(data, 'binary');
        next();
      })
      .catch((error) => {
        next(error);
      });
  });

  /* Add content type to an image (png/image)! */
  Picture.afterRemote('findById', (ctx, modelInstance) => {
    ctx.res.setHeader('content-type', 'image/png');
    ctx.res.end(modelInstance.data);
  });
};
