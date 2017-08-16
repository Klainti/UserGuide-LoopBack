'use strict';

const path = require('path');

module.exports = function () {
  return function customRaiseUrlNotFoundError(req, res) {
    res.sendFile(path.join(__dirname, '../../client/index.html'), (err) => {
      if (err) {
        console.error(err);
        res.status(err.status).end();
      }
    });
  };
};
