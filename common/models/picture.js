'use strict';

const request = require('request-promise');

module.exports = (Picture) => {
  /* Download image from given url */
  Picture.download = (url, name) => {
    const image = new Promise((resolve, reject) => {
      request(url, { encoding: 'binary' }) // download image
        .then((data) => {
          const buffer = new Buffer(data, 'binary');
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

  /* Add content type to an image (png/image)! */
  Picture.afterRemote('findById', (ctx, modelInstance) => {
    ctx.res.setHeader('content-type', 'image/png');
    ctx.res.end(modelInstance.data);
  });
};
