'use strict';

const path = require('path');

/* UrlNotFoundHandler. Send index if url not found! */
module.exports = function () {
  return ((req, res) => {
    res.sendFile(path.join(__dirname, '../../client/index.html'), (err) => {
      if (err) {
        res.status(err.status).end();
      }
    });
  });
};

