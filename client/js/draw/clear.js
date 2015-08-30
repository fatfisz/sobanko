'use strict';

var { context } = require('../utils');

module.exports = function clearContext() {
  var { width, height } = context.canvas;

  context.clearRect(0, 0, width, height);
};
