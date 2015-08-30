'use strict';

var { tileSize } = require('../constants');
var { context } = require('../utils');


// TODO: Replace this with proper tiles
var colors = [
  null,
  'grey',
  'black',
  'brown',
  'red',
  'pink',
];

module.exports = function drawTile(tile, x, y) {
  var color = colors[tile];

  if (!color) {
    return;
  }

  context.fillStyle = color;
  context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
};
