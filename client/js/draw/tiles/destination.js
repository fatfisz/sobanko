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

  context.beginPath();
  context.strokeStyle = 'rgba(0, 0, 0, .17)';
  context.fillStyle = connectorColor;
  context.moveTo(connectorOffset, tileSize / 2);
  context.arcTo(connectorOffset, tileSize / 2 - connectorRadius,
                tileSize / 2, tileSize / 2 - connectorRadius,
                connectorRadius);
  context.arcTo(tileSize - connectorOffset, tileSize / 2 - connectorRadius,
                tileSize - connectorOffset, tileSize / 2,
                connectorRadius);
  context.arcTo(tileSize - connectorOffset, tileSize / 2 + connectorRadius,
                tileSize / 2, tileSize / 2 + connectorRadius,
                connectorRadius);
  context.arcTo(connectorOffset, tileSize / 2 + connectorRadius,
                connectorOffset, tileSize / 2,
                connectorRadius);
  context.fill();
  context.stroke();

  context.beginPath();
  context.strokeStyle = 'rgba(0, 0, 0, .17)';
  context.fillStyle = connectorColor;
  context.moveTo(tileSize / 2, connectorOffset);
  context.arcTo(tileSize / 2 - connectorRadius, connectorOffset,
                tileSize / 2 - connectorRadius, tileSize / 2,
                connectorRadius);
  context.arcTo(tileSize / 2 - connectorRadius, tileSize - connectorOffset,
                tileSize / 2, tileSize - connectorOffset,
                connectorRadius);
  context.arcTo(tileSize / 2 + connectorRadius, tileSize - connectorOffset,
                tileSize / 2 + connectorRadius, tileSize / 2,
                connectorRadius);
  context.arcTo(tileSize / 2 + connectorRadius, connectorOffset,
                tileSize / 2, connectorOffset,
                connectorRadius);
  context.fill();
  context.stroke();


  context.beginPath();
  context.fillStyle = socketColor;
  context.arc(tileSize / 2, tileSize / 2,
              tileSize / 2 - socketOffset * 2,
              0, 2 * Math.PI);
  context.closePath();
  context.fill();
}

var destination = tilePrerender(drawDestinationHelper);

module.exports = function drawDestination(drawX, drawY, data, x, y) {
  drawFloor(drawX, drawY, data, x, y);
  context.drawImage(destination, drawX, drawY);
};
