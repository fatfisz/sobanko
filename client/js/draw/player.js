'use strict';

var { tileSize } = require('../constants');
var { getBoxPosition, context } = require('../utils');
var drawLevelFragment = require('./level_fragment');
var drawTile = require('./tile');


function draw(x, y) {
  context.fillStyle = 'blue';
  context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
}

module.exports = function drawPlayer(level) {
  var {
    currentState,
    playerMoving,
    offsetX,
    offsetY,
    playerX,
    playerY,
    prevBoxType,
  } = level;
  var xLo = Math.floor(playerX) - 2;
  var xHi = Math.ceil(playerX) + 2;
  var yLo = Math.floor(playerY) - 2;
  var yHi = Math.ceil(playerY) + 2;

  drawLevelFragment(level, xLo, yLo, xHi - xLo + 1, yHi - yLo + 1);
  draw(offsetX + playerX, offsetY + playerY);

  if (playerMoving && currentState.pulling) {
    var [boxX, boxY] = getBoxPosition(currentState.direction, playerX, playerY);

    drawTile(offsetX, offsetY, prevBoxType, boxX, boxY);
  }
};
