'use strict';

var { tileSize } = require('../../constants');
var { context, isWallOrEmptyTile } = require('../../utils');


module.exports = function drawWall(level, x, y) {
  var color = '#666';
  var width = 12;
  var radius = 6;

  context.save();

  context.translate(x * tileSize, y * tileSize);

  context.fillStyle = color;

  if (y > 0) {
    if (!isWallOrEmptyTile(level.getTile([x - 1, y - 1]))) {
      context.corner(0, 0, width, width, radius);
      context.fill();
    }

    if (!isWallOrEmptyTile(level.getTile([x, y - 1]))) {
      context.fillRect(0, 0, tileSize, width);
    }

    if (!isWallOrEmptyTile(level.getTile([x + 1, y - 1]))) {
      context.corner(tileSize, 0, tileSize - width, width, radius);
      context.fill();
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
      context.corner(0, tileSize, width, tileSize - width, radius);
      context.fill();
    }

    if (!isWallOrEmptyTile(level.getTile([x, y + 1]))) {
      context.fillRect(0, tileSize - width, tileSize, width);
    }

    if (!isWallOrEmptyTile(level.getTile([x + 1, y + 1]))) {
      context.corner(tileSize, tileSize, tileSize - width, tileSize - width, radius);
      context.fill();
    }
  }

  context.restore();
};
