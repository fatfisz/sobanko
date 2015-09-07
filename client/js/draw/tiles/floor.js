/*
 * Sobanko
 * https://github.com/fatfisz/sobanko
 *
 * Copyright (c) 2015 FatFisz
 * Licensed under the MIT license.
 */

'use strict';

var { tileSize } = require('../../constants');
var { context } = require('../../utils');


var variants = [
  '#f7f9fd',
  '#fdfdfa',
  '#f5f6f8',
  '#fdfdfd',
  '#f7f8fa',
];

module.exports = function drawFloor(level, x, y) {
  var which = (x + y * 2) % 5;

  context.fillStyle = variants[which];
  context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
  context.strokeStyle = 'rgba(0, 0, 0, .04)';
  context.strokeRect(x * tileSize + .5, y * tileSize + .5, tileSize - 1, tileSize - 1);
};
