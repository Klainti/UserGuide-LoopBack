'use strict';

const request = require('request');

module.exports = (Picture) => {
  /* Download image from given url */
  Picture.beforeRemote('create', (ctx, modelInstance, next) => {
    request.get({ url: ctx.req.body.url, encoding: 'binary' }, (err, response, body) => {
      if (err) {
        next(err);
      } else if (response.statusCode !== 200) {
        next(response.statusCode);
      } else {
        const buffer = new Buffer(body, 'binary');
        ctx.req.body.data = buffer;
        next();
      }
    });
  });

};
