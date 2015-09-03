'use strict';

var { tileSize } = require('../../constants');
var { context } = require('../../utils');
var drawFloor = require('./floor');
var tilePrerender = require('./tile_prerender');


function drawBoxHelper(bumperColor, context) {
  var bumperOffset = 5;
  var bodyColor = '#b4b4b4';
  var offset = 4;
  var radius = 5;

  context.beginPath();
  context.strokeStyle = 'rgba(0, 0, 0, .1)';
  context.fillStyle = bumperColor;
  context.moveTo(bumperOffset * 2, bumperOffset);
  context.arcTo(bumperOffset * 2, 0,
                tileSize - bumperOffset * 3, 0,
                bumperOffset);
  context.arcTo(tileSize - bumperOffset * 2, 0,
                tileSize - bumperOffset * 2, bumperOffset,
                bumperOffset);
  context.lineTo(tileSize - bumperOffset, bumperOffset * 2);
  context.arcTo(tileSize, bumperOffset * 2,
                tileSize, tileSize - bumperOffset * 3,
                bumperOffset);
  context.arcTo(tileSize, tileSize - bumperOffset * 2,
                tileSize - bumperOffset, tileSize - bumperOffset * 2,
                bumperOffset);
  context.lineTo(tileSize - bumperOffset * 2, tileSize - bumperOffset);
  context.arcTo(tileSize - bumperOffset * 2, tileSize,
                bumperOffset * 3, tileSize,
                bumperOffset);
  context.arcTo(bumperOffset * 2, tileSize,
                bumperOffset * 2, tileSize - bumperOffset,
                bumperOffset);
  context.lineTo(bumperOffset, tileSize - bumperOffset * 2);
  context.arcTo(0, tileSize - bumperOffset * 2,
                0, bumperOffset * 3,
                bumperOffset);
  context.arcTo(0, bumperOffset * 2,
                bumperOffset, bumperOffset * 2,
                bumperOffset);
  context.closePath();
  context.fill();
  context.stroke();

  context.beginPath();
  context.strokeStyle = 'rgba(0, 0, 0, .17)';
  context.fillStyle = bodyColor;
  context.moveTo(offset * 2, offset);
  context.arcTo(tileSize - offset, offset, tileSize - offset, offset * 2, radius);
  context.arcTo(tileSize - offset, tileSize - offset, tileSize - offset * 2, tileSize - offset, radius);
  context.arcTo(offset, tileSize - offset, offset, tileSize - offset * 2, radius);
  context.arcTo(offset, offset, offset * 2, offset, radius);
  context.fill();
  context.stroke();

  context.beginPath();
  context.strokeStyle = 'rgba(0, 0, 0, .17)';
  context.fillStyle = bumperColor;
  context.arc(tileSize / 2, tileSize / 2, tileSize / 2 - bumperOffset * 2, 0, 2 * Math.PI);
  context.closePath();
  context.fill();
  context.stroke();
}

var box = tilePrerender(drawBoxHelper.bind(null, '#ccd7ea'));
var boxInDestination = tilePrerender(drawBoxHelper.bind(null, '#9be581'));

module.exports = {

  drawBox(level, x, y, drawX, drawY, forceOnlyTile) {
    if (!forceOnlyTile) {
      drawFloor(level, x, y, drawX, drawY);
    }

    context.drawImage(box, drawX, drawY);
  },

  drawBoxInDestination(level, x, y, drawX, drawY, forceOnlyTile) {
    if (!forceOnlyTile) {
      drawFloor(level, x, y, drawX, drawY);
    }

    context.drawImage(boxInDestination, drawX, drawY);
  },

};
