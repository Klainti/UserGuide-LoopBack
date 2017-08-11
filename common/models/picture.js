'use strict';

const request = require('request');

module.exports = (Picture) => {
  /* Download image from given url */
  Picture.beforeRemote('create', (ctx, unused, next) => {
    request.get({ url: ctx.req.body.url, encoding: 'binary' }, (err, response, body) => {
      if (err) {
        next(err);
      } else if (response.statusCode !== 200) {
        next(response.statusCode);
      } else {
        ctx.req.body.data = new Buffer(body, 'binary');
        next();
      }
    });
  });

  /* Add content type to an image (png/image)! */
  Picture.afterRemote('findById', (ctx, modelInstance) => {
    ctx.res.setHeader('content-type', 'image/png');
    ctx.res.end(modelInstance.data);
  });
};
