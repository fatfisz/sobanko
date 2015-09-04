'use strict';

var { tileSize } = require('../../constants');
var { context } = require('../../utils');


var variants = [
  '#f2f6fa',
  '#fafaf7',
  '#f0f1f5',
  '#fafafa',
  '#f2f3f7',
];

module.exports = function drawFloor(level, x, y) {
  var which = (x + y * 2) % 5;

  context.fillStyle = variants[which];
  context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
  context.strokeStyle = 'rgba(0, 0, 0, .03)';
  context.strokeRect(x * tileSize + .5, y * tileSize + .5, tileSize - 1, tileSize - 1);
};
