'use strict';

var { tileSize } = require('../constants');
var { context, isWallOrEmptyTile } = require('../utils');


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

function drawFloorHelper(drawX, drawY, data, x, y) {
  var variants = [
    '#f2f6fa',
    '#fafaf7',
    '#f0f1f5',
    '#fafafa',
    '#f2f3f7',
  ];
  var which = (x + y * 2) % 5;

  context.fillStyle = variants[which];
  context.fillRect(drawX, drawY, tileSize, tileSize);
}

function drawBoxHelper(x, y, bumperColor) {
  var bumperOffset = 5;
  var bodyColor = '#b4b4b4';
  var offset = 4;
  var radius = 5;

  context.beginPath();
  context.strokeStyle = 'rgba(0, 0, 0, .1)';
  context.fillStyle = bumperColor;
  context.moveTo(x + bumperOffset * 2, y + bumperOffset);
  context.arcTo(x + bumperOffset * 2, y,
                x + tileSize - bumperOffset * 3, y,
                bumperOffset);
  context.arcTo(x + tileSize - bumperOffset * 2, y,
                x + tileSize - bumperOffset * 2, y + bumperOffset,
                bumperOffset);
  context.lineTo(x + tileSize - bumperOffset, y + bumperOffset * 2);
  context.arcTo(x + tileSize, y + bumperOffset * 2,
                x + tileSize, y + tileSize - bumperOffset * 3,
                bumperOffset);
  context.arcTo(x + tileSize, y + tileSize - bumperOffset * 2,
                x + tileSize - bumperOffset, y + tileSize - bumperOffset * 2,
                bumperOffset);
  context.lineTo(x + tileSize - bumperOffset * 2, y + tileSize - bumperOffset);
  context.arcTo(x + tileSize - bumperOffset * 2, y + tileSize,
                x + bumperOffset * 3, y + tileSize,
                bumperOffset);
  context.arcTo(x + bumperOffset * 2, y + tileSize,
                x + bumperOffset * 2, y + tileSize - bumperOffset,
                bumperOffset);
  context.lineTo(x + bumperOffset, y + tileSize - bumperOffset * 2);
  context.arcTo(x, y + tileSize - bumperOffset * 2,
                x, y + bumperOffset * 3,
                bumperOffset);
  context.arcTo(x, y + bumperOffset * 2,
                x + bumperOffset, y + bumperOffset * 2,
                bumperOffset);
  context.closePath();
  context.fill();
  context.stroke();

  context.beginPath();
  context.fillStyle = bodyColor;
  context.moveTo(x + offset * 2, y + offset);
  context.arcTo(x + tileSize - offset, y + offset, x + tileSize - offset, y + offset * 2, radius);
  context.arcTo(x + tileSize - offset, y + tileSize - offset, x + tileSize - offset * 2, y + tileSize - offset, radius);
  context.arcTo(x + offset, y + tileSize - offset, x + offset, y + tileSize - offset * 2, radius);
  context.arcTo(x + offset, y + offset, x + offset * 2, y + offset, radius);
  context.fill();

  context.beginPath();
  context.strokeStyle = 'rgba(0, 0, 0, .17)';
  context.fillStyle = bumperColor;
  context.arc(x + tileSize / 2, y + tileSize / 2, tileSize / 2 - bumperOffset * 2, 0, 2 * Math.PI);
  context.closePath();
  context.fill();
  context.stroke();
}

var drawingFunctions = [
  null,
  function drawWall(drawX, drawY, data, x, y) {
    drawWallHelper(drawX, drawY, data, x, y, 12, '#666');
    drawWallHelper(drawX, drawY, data, x, y, 2, '#555');
  },
  drawFloorHelper,
  function drawBox(drawX, drawY, data, x, y) {
    if (Array.isArray(data)) {
      drawFloorHelper(drawX, drawY, data, x, y);
    }
    drawBoxHelper(drawX, drawY, '#ccd7ea');
  },
  function drawDestination(drawX, drawY, data, x, y) {
    drawFloorHelper(drawX, drawY, data, x, y);

    var connectorColor = '#ed7d56';
    var connectorOffset = 11;
    var connectorRadius = 1;
    var socketColor = '#eda991';
    var socketOffset = 7;

    context.beginPath();
    context.strokeStyle = 'rgba(0, 0, 0, .17)';
    context.fillStyle = connectorColor;
    context.moveTo(drawX + connectorOffset, drawY + tileSize / 2);
    context.arcTo(drawX + connectorOffset, drawY + tileSize / 2 - connectorRadius,
                  drawX + tileSize / 2, drawY + tileSize / 2 - connectorRadius,
                  connectorRadius);
    context.arcTo(drawX + tileSize - connectorOffset, drawY + tileSize / 2 - connectorRadius,
                  drawX + tileSize - connectorOffset, drawY + tileSize / 2,
                  connectorRadius);
    context.arcTo(drawX + tileSize - connectorOffset, drawY + tileSize / 2 + connectorRadius,
                  drawX + tileSize / 2, drawY + tileSize / 2 + connectorRadius,
                  connectorRadius);
    context.arcTo(drawX + connectorOffset, drawY + tileSize / 2 + connectorRadius,
                  drawX + connectorOffset, drawY + tileSize / 2,
                  connectorRadius);
    context.fill();
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'rgba(0, 0, 0, .17)';
    context.fillStyle = connectorColor;
    context.moveTo(drawX + tileSize / 2, drawY + connectorOffset);
    context.arcTo(drawX + tileSize / 2 - connectorRadius, drawY + connectorOffset,
                  drawX + tileSize / 2 - connectorRadius, drawY + tileSize / 2,
                  connectorRadius);
    context.arcTo(drawX + tileSize / 2 - connectorRadius, drawY + tileSize - connectorOffset,
                  drawX + tileSize / 2, drawY + tileSize - connectorOffset,
                  connectorRadius);
    context.arcTo(drawX + tileSize / 2 + connectorRadius, drawY + tileSize - connectorOffset,
                  drawX + tileSize / 2 + connectorRadius, drawY + tileSize / 2,
                  connectorRadius);
    context.arcTo(drawX + tileSize / 2 + connectorRadius, drawY + connectorOffset,
                  drawX + tileSize / 2, drawY + connectorOffset,
                  connectorRadius);
    context.fill();
    context.stroke();


    context.beginPath();
    context.fillStyle = socketColor;
    context.arc(drawX + tileSize / 2, drawY + tileSize / 2, tileSize / 2 - socketOffset * 2, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
  },
  function drawBoxInDestination(drawX, drawY, data, x, y) {
    if (Array.isArray(data)) {
      drawFloorHelper(drawX, drawY, data, x, y);
    }
    drawBoxHelper(drawX, drawY, '#9be581');
  },
];

module.exports = function drawTile(offsetX, offsetY, data, x, y) {
  var tile;

  if (Array.isArray(data)) {
    tile = data[y][x];
  } else {
    tile = data;
  }

  if (!drawingFunctions[tile]) {
    return;
  }

  drawingFunctions[tile](
    (offsetX + x) * tileSize,
    (offsetY + y) * tileSize,
    data,
    x,
    y
  );
};
