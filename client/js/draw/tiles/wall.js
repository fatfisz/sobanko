'use strict';

var { tileSize } = require('../../constants');
var { context, isWallOrEmptyTile } = require('../../utils');


module.exports = function drawWall(level, x, y) {
  var color = '#666';
  var width = 12;


  context.save();

  context.translate(x * tileSize, y * tileSize);

  context.fillStyle = color;

  if (y > 0) {
    if (!isWallOrEmptyTile(level.getTile([x - 1, y - 1]))) {
      context.fillRect(0, 0, width, width);
    }

    if (!isWallOrEmptyTile(level.getTile([x, y - 1]))) {
      context.fillRect(0, 0, tileSize, width);
    }

    if (!isWallOrEmptyTile(level.getTile([x + 1, y - 1]))) {
      context.fillRect(tileSize - width, 0, width, width);
    }
  }

  if (!isWallOrEmptyTile(level.getTile([x - 1, y]))) {
    context.fillRect(0, 0, width, tileSize);
  }

  if (!isWallOrEmptyTile(level.getTile([x + 1, y]))) {
    context.fillRect(tileSize - width, 0, width, tileSize);
  }

  if (y < level.height - 1) {
    if (!isWallOrEmptyTile(level.getTile([x - 1, y + 1]))) {
      context.fillRect(0, tileSize - width, width, width);
    }

    if (!isWallOrEmptyTile(level.getTile([x, y + 1]))) {
      context.fillRect(0, tileSize - width, tileSize, width);
    }

    if (!isWallOrEmptyTile(level.getTile([x + 1, y + 1]))) {
      context.fillRect(tileSize - width, tileSize - width, width, width);
    }
  }

  context.restore();
};
