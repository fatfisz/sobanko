'use strict';

var { tileSize } = require('../constants');
var { context } = require('../utils');
var drawLevelFragment = require('./level_fragment');


function draw(level) {
  context.fillStyle = 'blue';
  context.fillRect(
    (level.offsetX + level.playerX) * tileSize,
    (level.offsetY + level.playerY) * tileSize,
    tileSize,
    tileSize
  );
}

module.exports = function drawPlayer(level) {
  var xLo = Math.floor(level.playerX) - 2;
  var xHi = Math.ceil(level.playerX) + 2;
  var yLo = Math.floor(level.playerY) - 2;
  var yHi = Math.ceil(level.playerY) + 2;

  drawLevelFragment(level, xLo, yLo, xHi - xLo + 1, yHi - yLo + 1);
  draw(level);
};
