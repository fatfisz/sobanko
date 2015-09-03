'use strict';

var { width, height, tileSize } = require('../constants');
var { context } = require('../utils');


module.exports = function clearContext() {
  context.clearRect(0, 0, width * tileSize, height * tileSize);
};
