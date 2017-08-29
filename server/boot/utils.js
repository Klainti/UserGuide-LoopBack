'use strict';

const Utils = require('../lib/Utils');

module.exports = function enableTree(app) {
  // enable Tree Structure Lib
  app.utils = new Utils(app);
};
