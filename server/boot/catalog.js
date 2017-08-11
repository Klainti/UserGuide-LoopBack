'use strict';

const Catalog = require('../../lib/Catalog');

module.exports = function enableTree(app) {
  // enable Tree Structure Lib
  app.catalog = new Catalog(app);
};
