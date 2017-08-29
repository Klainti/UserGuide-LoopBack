'use strict';

const MyTreeStructure = require('../lib/MyTreeStructure');

module.exports = function enableTree(app) {
  // enable Tree Structure Lib
  app.FS = new MyTreeStructure(app);
};
