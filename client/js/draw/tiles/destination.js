'use strict';

var { tileSize } = require('../../constants');
var { context } = require('../../utils');
var drawFloor = require('./floor');
var tilePrerender = require('./tile_prerender');


function drawDestinationHelper(context) {
  var connectorColor = '#ed7d56';
  var connectorOffset = 11;
  var connectorRadius = 1;
  var socketColor = '#eda991';
  var socketOffset = 7;

  context.strokeStyle = 'rgba(0, 0, 0, .17)';
  context.fillStyle = connectorColor;

  context.roundedRect(
    connectorOffset, tileSize / 2 - connectorRadius,
    tileSize - connectorOffset, tileSize / 2 + connectorRadius,
    connectorRadius
  );
  context.fill();
  context.stroke();

  context.roundedRect(
    tileSize / 2 - connectorRadius, connectorOffset,
    tileSize / 2 + connectorRadius, tileSize - connectorOffset,
    connectorRadius
  );
  context.fill();
  context.stroke();

  context.circle(tileSize / 2, tileSize / 2, tileSize / 2 - socketOffset * 2);
  context.fillStyle = socketColor;
  context.fill();
}

var destination = tilePrerender(drawDestinationHelper);

module.exports = function drawDestination(level, x, y) {
  drawFloor(level, x, y);
  context.drawImage(destination, x * tileSize, y * tileSize);
};
