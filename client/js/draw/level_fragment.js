'use strict';

var { tileSize } = require('../constants');
var { context } = require('../utils');
var drawTile = require('./tile');


function isValidPosition(level, x, y) {
  return x >= 0 && y >= 0 && x < level.width && y < level.height;
}

module.exports = function drawLevelFragment(level, sx, sy, width, height) {
  var { data, offsetX, offsetY } = level;

  context.clearRect(
    (offsetX + sx) * tileSize,
    (offsetY + sy) * tileSize,
    width * tileSize,
    height * tileSize
  );

  for (var y = sy; y < sy + height; y += 1) {
    for (var x = sx; x < sx + width; x += 1) {
      if (!isValidPosition(level, x, y)) {
        continue;
      }

      drawTile(offsetX, offsetY, data, x, y);
    }
  }
};
