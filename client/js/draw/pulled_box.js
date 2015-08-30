'use strict';

var { getBoxPosition } = require('../utils');
var drawTile = require('./tile');


module.exports = function drawPulledBox(level) {
  var { pulledBox, playerX, playerY, offsetX, offsetY } = level;
  var [boxX, boxY] = getBoxPosition(pulledBox.direction, playerX, playerY);

  drawTile(pulledBox.type, offsetX + boxX, offsetY + boxY);
};
