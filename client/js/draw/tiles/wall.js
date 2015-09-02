'use strict';

var { tileSize } = require('../../constants');
var { context, isWallOrEmptyTile } = require('../../utils');


function drawWallHelper(drawX, drawY, data, x, y, width, color) {
  context.fillStyle = color;

  if (data[y - 1]) {
    if (!isWallOrEmptyTile(data[y - 1][x - 1])) {
      context.fillRect(drawX, drawY, width, width);
    }

    if (!isWallOrEmptyTile(data[y - 1][x])) {
      context.fillRect(drawX, drawY, tileSize, width);
    }

    if (!isWallOrEmptyTile(data[y - 1][x + 1])) {
      context.fillRect(drawX + tileSize - width, drawY, width, width);
    }
  }

  if (data[y]) {
    if (!isWallOrEmptyTile(data[y][x - 1])) {
      context.fillRect(drawX, drawY, width, tileSize);
    }

    if (!isWallOrEmptyTile(data[y][x + 1])) {
      context.fillRect(drawX + tileSize - width, drawY, width, tileSize);
    }
  }

  if (data[y + 1]) {
    if (!isWallOrEmptyTile(data[y + 1][x - 1])) {
      context.fillRect(drawX, drawY + tileSize - width, width, width);
    }

    if (!isWallOrEmptyTile(data[y + 1][x])) {
      context.fillRect(drawX, drawY + tileSize - width, tileSize, width);
    }

    if (!isWallOrEmptyTile(data[y + 1][x + 1])) {
      context.fillRect(drawX + tileSize - width, drawY + tileSize - width, width, width);
    }
  }
}

module.exports = function drawWall(drawX, drawY, data, x, y) {
  drawWallHelper(drawX, drawY, data, x, y, 12, '#666');
  drawWallHelper(drawX, drawY, data, x, y, 2, '#555');
};
