'use strict';

var { tileSize } = require('../constants');
var { context } = require('../utils');
var drawTile = require('./tile');


function isValidPosition(level, x, y) {
  return x >= 0 && y >= 0 && x < level.width && y < level.height;
}

module.exports = function drawLevelFragment(level, x, y, width, height) {
  var { data, offsetX, offsetY } = level;
  var xMod;
  var yMod;

  context.clearRect(
    (offsetX + x) * tileSize,
    (offsetY + y) * tileSize,
    width * tileSize,
    height * tileSize
  );

  for (yMod = 0; yMod < height; yMod += 1) {
    for (xMod = 0; xMod < width; xMod += 1) {
      if (!isValidPosition(level, xMod + x, yMod + y)) {
        continue;
      }

      drawTile(offsetX, offsetY, data, xMod + x, yMod + y);
    }
  }
};
