'use strict';

var { getTileFromName, getBoxPosition } = require('../utils');
var drawTile = require('./tile');


var box = getTileFromName('box');

module.exports = function drawPulledBox(level) {
  var { pulledBoxDirection, playerX, playerY, offsetX, offsetY } = level;
  var [boxX, boxY] = getBoxPosition(pulledBoxDirection, playerX, playerY);

  drawTile(offsetX, offsetY, box, boxX, boxY);
};
