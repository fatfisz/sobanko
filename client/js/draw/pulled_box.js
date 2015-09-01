'use strict';

var { getBoxPosition } = require('../utils');
var drawTile = require('./tile');


module.exports = function drawPulledBox(level) {
  var { pulledBoxState, playerX, playerY, offsetX, offsetY } = level;
  var { direction, type } = pulledBoxState;
  var [boxX, boxY] = getBoxPosition(direction, playerX, playerY);

  drawTile(offsetX, offsetY, type, boxX, boxY);
};
