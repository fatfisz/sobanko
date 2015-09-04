'use strict';

var { tileSize } = require('../constants');
var controls = require('../controls');
var { context, directionToDirectionMod, getBoxPosition } = require('../utils');
var drawLevelFragment = require('./level_fragment');
var drawTile = require('./tile');


function beginRoundedRect(x1, y1, x2, y2, radius) {
  var halfX = (x1 + x2) / 2;
  var halfY = (y1 + y2) / 2;

  context.beginPath();
  context.moveTo(x1, halfY);
  context.arcTo(x1, y1, halfX, y1, radius);
  context.arcTo(x2, y1, x2, halfY, radius);
  context.arcTo(x2, y2, halfX, y2, radius);
  context.arcTo(x1, y2, x1, halfY, radius);
  context.closePath();
}

function beginCircle(x, y, radius) {
  beginRoundedRect(x - radius, y - radius, x + radius, y + radius, radius);
}

function rotate(x, y, direction) {
  switch (direction) {
    case 'down':
      context.transform(-1, 0, 0, -1, (x + 1) * tileSize, (y + 1) * tileSize);
      break;
    case 'left':
      context.transform(0, -1, 1, 0, x * tileSize, (y + 1) * tileSize);
      break;
    case 'right':
      context.transform(0, 1, -1, 0, (x + 1) * tileSize, y * tileSize);
      break;
    default:
      context.transform(1, 0, 0, 1, x * tileSize, y * tileSize);
      break;
  }
}

var foldedArmStops = [
  tileSize / 2 - 2,
  tileSize * 3 / 4,
  tileSize * 3 / 4 - 1,
  tileSize / 2 - 6,
];
var stretchedArmStops = [
  tileSize / 2 + 2,
  tileSize / 4 + 2,
  tileSize / 4 + 4,
  1,
];

function draw(x, y, direction, pulling) {
  var horzOffset = 8;

  var trackColor = '#777';
  var topTrackY = 13;
  var bottomTrackY = tileSize - 10;
  var trackRadius = 1.5;
  var trackWidth = 6;
  var trackDensity = 3;
  var trackOffset = directionToDirectionMod[direction] * (x + y) * tileSize;
  var trackStart =
    Math.ceil((trackOffset + topTrackY) / trackDensity) * trackDensity - trackOffset;
  var trackLimit =
    Math.floor((trackOffset + bottomTrackY) / trackDensity) * trackDensity - trackOffset;

  var pipeColor = '#666';
  var pipeWidth = 4;
  var pipeHorzOffset = 17;
  var pipeVertOffset = 4;
  var pipeRadius = 1;

  var bodyColor = '#c8e';
  var vertBodyPadding = 6;
  var bodyRadius = 5;

  var armBaseColor = '#daf';
  var armBaseRadius = 8;

  var armColor = '#fafafa';
  var firstArmPartWidth = 6;
  var secondArmPartWidth = 5;
  var armPartRadius = 1;
  var armStops = pulling || controls.state.pulling ? stretchedArmStops : foldedArmStops;

  var diskColor = '#fafafa';
  var diskWidth = 12;
  var diskY = armStops[3] - 1;
  var controlPointY = diskY + 7;

  context.save();

  rotate(x, y, direction);

  if (pulling) {
    rotate(0, 0, 'down');
  }

  // Tracks
  context.fillStyle = trackColor;
  context.strokeStyle = 'rgba(0, 0, 0, .25)';

  beginRoundedRect(
    horzOffset, topTrackY - 1,
    horzOffset + trackWidth, bottomTrackY + 1,
    trackRadius
  );
  context.fill();
  context.stroke();

  beginRoundedRect(
    tileSize - horzOffset - trackWidth, topTrackY - 1,
    tileSize - horzOffset, bottomTrackY + 1,
    trackRadius
  );
  context.fill();
  context.stroke();

  context.beginPath();
  for (var i = trackStart; i <= trackLimit; i += trackDensity) {
    context.moveTo(horzOffset - .5, i + .5);
    context.lineTo(horzOffset + trackWidth + .5, i + .5);

    context.moveTo(tileSize - horzOffset - trackWidth - .5, i + .5);
    context.lineTo(tileSize - horzOffset + .5, i + .5);
  }
  context.strokeStyle = 'rgba(0, 0, 0, .17)';
  context.stroke();

  // Exhaust pipes
  context.fillStyle = pipeColor;
  context.strokeStyle = 'rgba(0, 0, 0, .25)';

  beginRoundedRect(
    pipeHorzOffset, tileSize - pipeVertOffset,
    pipeHorzOffset + pipeWidth, tileSize / 2,
    pipeRadius
  );
  context.fill();
  context.stroke();

  beginRoundedRect(
    tileSize - pipeHorzOffset - pipeWidth, tileSize - pipeVertOffset,
    tileSize - pipeHorzOffset, tileSize / 2,
    pipeRadius
  );
  context.fill();
  context.stroke();

  // Body
  beginRoundedRect(
    horzOffset + trackWidth, vertBodyPadding,
    tileSize - horzOffset - trackWidth, tileSize - vertBodyPadding,
    bodyRadius
  );
  context.fillStyle = bodyColor;
  context.fill();
  context.strokeStyle = 'rgba(0, 0, 0, .17)';
  context.stroke();

  // Arm base
  beginCircle(tileSize / 2, tileSize / 2, armBaseRadius);
  context.fillStyle = armBaseColor;
  context.fill();
  context.strokeStyle = 'rgba(0, 0, 0, .1)';
  context.stroke();

  // Arm part style
  context.fillStyle = armColor;
  context.strokeStyle = 'rgba(0, 0, 0, .25)';

  // First arm part
  beginRoundedRect(
    (tileSize - firstArmPartWidth) / 2, armStops[0],
    (tileSize + firstArmPartWidth) / 2, armStops[1],
    armPartRadius
  );
  context.fill();
  context.stroke();

  // First arm part
  beginRoundedRect(
    (tileSize - secondArmPartWidth) / 2, armStops[2],
    (tileSize + secondArmPartWidth) / 2, armStops[3],
    armPartRadius
  );
  context.fill();
  context.stroke();

  // Disk
  context.beginPath();
  context.moveTo((tileSize - diskWidth) / 2, diskY);
  context.bezierCurveTo(
    (tileSize - diskWidth) / 2, controlPointY,
    (tileSize + diskWidth) / 2, controlPointY,
    (tileSize + diskWidth) / 2, diskY
  );
  context.closePath();

  context.fillStyle = diskColor;
  context.fill();
  context.strokeStyle = 'rgba(0, 0, 0, .25)';
  context.stroke();

  context.restore();
}

module.exports = function drawPlayer(level) {
  var {
    direction,
    pulling,
    moving,
    playerPos,
    offset,
    prevBoxType,
  } = level;
  var [playerX, playerY] = playerPos;
  var [offsetX, offsetY] = offset;
  var xLo = Math.floor(playerX) - 2;
  var xHi = Math.ceil(playerX) + 2;
  var yLo = Math.floor(playerY) - 2;
  var yHi = Math.ceil(playerY) + 2;

  drawLevelFragment(level, xLo, yLo, xHi - xLo + 1, yHi - yLo + 1);

  // First, draw the pulled box if there is one
  if (moving && pulling) {
    var boxPos = getBoxPosition(direction, playerPos);

    drawTile(level, boxPos, prevBoxType);
  }

  draw(offsetX + playerX, offsetY + playerY, direction, moving && pulling);
};
