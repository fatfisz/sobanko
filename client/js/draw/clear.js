'use strict';

var { width, height, tileSize } = require('../constants');
var { context } = require('../utils');


module.exports = function clearContext() {
  context.save();
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, width * tileSize, height * tileSize);
  context.restore();
};
