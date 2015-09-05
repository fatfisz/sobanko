'use strict';

var { tileSize } = require('../../constants');
var { context } = require('../../utils');


var variants = [
  '#f6f8fc',
  '#fcfcf9',
  '#f4f5f7',
  '#fcfcfc',
  '#f6f7f9',
];

module.exports = function drawFloor(level, x, y) {
  var which = (x + y * 2) % 5;

  context.fillStyle = variants[which];
  context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
  context.strokeStyle = 'rgba(0, 0, 0, .04)';
  context.strokeRect(x * tileSize + .5, y * tileSize + .5, tileSize - 1, tileSize - 1);
};
