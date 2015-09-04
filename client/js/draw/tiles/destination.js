'use strict';

var { tileSize } = require('../../constants');
var { context } = require('../../utils');
var drawFloor = require('./floor');
var tilePrerender = require('./tile_prerender');


function drawDestinationHelper(context) {
  var connectorColor = '#D17236';
  var connectorOffset = 11;
  var connectorWidth = 5;
  var connectorEnd = 18;
  var connectorRadius = 2;
  var socketColor = '#FF8B42';
  var socketOffset = 7;


  context.strokeStyle = 'rgba(0, 0, 0, .1)';

  context.circle(tileSize / 2, tileSize / 2, tileSize / 2 - socketOffset * 2);
  context.fillStyle = socketColor;
  context.fill();
  context.stroke();

  context.fillStyle = connectorColor;

  context.roundedRect(
    connectorOffset, (tileSize - connectorWidth) / 2,
    connectorEnd, (tileSize + connectorWidth) / 2,
    connectorRadius
  );
  context.fill();
  context.stroke();

  context.roundedRect(
    tileSize - connectorEnd, (tileSize - connectorWidth) / 2,
    tileSize - connectorOffset, (tileSize + connectorWidth) / 2,
    connectorRadius
  );
  context.fill();
  context.stroke();

  context.roundedRect(
    (tileSize - connectorWidth) / 2, connectorOffset,
    (tileSize + connectorWidth) / 2, connectorEnd,
    connectorRadius
  );
  context.fill();
  context.stroke();

  context.roundedRect(
    (tileSize - connectorWidth) / 2, tileSize - connectorEnd,
    (tileSize + connectorWidth) / 2, tileSize - connectorOffset,
    connectorRadius
  );
  context.fill();
  context.stroke();
}

var destination = tilePrerender(drawDestinationHelper);

module.exports = function drawDestination(level, x, y) {
  drawFloor(level, x, y);
  context.drawImage(destination, x * tileSize, y * tileSize);
};
