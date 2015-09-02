'use strict';

var { width, height, tileSize } = require('../constants');
var { context } = require('../utils');


var viewportWidth = width * tileSize;
var viewportHeight = height * tileSize;

module.exports = function clearContext() {
  context.clearRect(0, 0, viewportWidth, viewportHeight);
};
