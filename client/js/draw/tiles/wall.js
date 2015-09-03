'use strict';

var { tileSize } = require('../../constants');
var { context, isWallOrEmptyTile } = require('../../utils');


function drawWallHelper(level, x, y, drawX, drawY, width, color) {
  context.fillStyle = color;

  if (y > 0) {
    if (!isWallOrEmptyTile(level.getTile([x - 1, y - 1]))) {
      context.fillRect(drawX, drawY, width, width);
    }

    if (!isWallOrEmptyTile(level.getTile([x, y - 1]))) {
      context.fillRect(drawX, drawY, tileSize, width);
    }

    if (!isWallOrEmptyTile(level.getTile([x + 1, y - 1]))) {
      context.fillRect(drawX + tileSize - width, drawY, width, width);
    }
  }

  if (!isWallOrEmptyTile(level.getTile([x - 1, y]))) {
    context.fillRect(drawX, drawY, width, tileSize);
  }

  if (!isWallOrEmptyTile(level.getTile([x + 1, y]))) {
    context.fillRect(drawX + tileSize - width, drawY, width, tileSize);
  }

  if (y < level.height - 1) {
    if (!isWallOrEmptyTile(level.getTile([x - 1, y + 1]))) {
      context.fillRect(drawX, drawY + tileSize - width, width, width);
    }

    if (!isWallOrEmptyTile(level.getTile([x, y + 1]))) {
      context.fillRect(drawX, drawY + tileSize - width, tileSize, width);
    }

    if (!isWallOrEmptyTile(level.getTile([x + 1, y + 1]))) {
      context.fillRect(drawX + tileSize - width, drawY + tileSize - width, width, width);
    }
  }
}

module.exports = function drawWall(level, x, y, drawX, drawY) {
  drawWallHelper(level, x, y, drawX, drawY, 12, '#666');
  drawWallHelper(level, x, y, drawX, drawY, 2, '#555');
};
