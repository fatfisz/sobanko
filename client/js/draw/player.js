/*
 * Sobanko
 * https://github.com/fatfisz/sobanko
 *
 * Copyright (c) 2015 FatFisz
 * Licensed under the MIT license.
 */

'use strict';

var { tileSize } = require('../constants');
var controls = require('../controls');
var { context, directionToDirectionMod, getBoxPosition } = require('../utils');
var drawLevelFragment = require('./level_fragment');
var drawTile = require('./tile');


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
  var firstArmPartWidth = 8;
  var secondArmPartWidth = 6;
  var armPartRadius = 1;
  var armStops = pulling || controls.state.pulling ? stretchedArmStops : foldedArmStops;

  var diskColor = '#fafafa';
  var diskWidth = 12;
  var diskY = armStops[3] - 1;
  var controlPointY = diskY + 7;

  context.save();

  context.basedRotate(x, y, direction);

  if (pulling) {
    context.basedRotate(0, 0, 'down');
  }

  // Tracks
  context.fillStyle = trackColor;
  context.strokeStyle = 'rgba(0, 0, 0, .3)';

  context.roundedRect(
    horzOffset, topTrackY - 1,
    horzOffset + trackWidth, bottomTrackY + 1,
    trackRadius
  );
  context.fill();
  context.stroke();

  context.roundedRect(
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
  context.strokeStyle = 'rgba(0, 0, 0, .1)';
  context.stroke();

  // Exhaust pipes
  context.fillStyle = pipeColor;
  context.strokeStyle = 'rgba(0, 0, 0, .3)';

  context.roundedRect(
    pipeHorzOffset, tileSize - pipeVertOffset,
    pipeHorzOffset + pipeWidth, tileSize / 2,
    pipeRadius
  );
  context.fill();
  context.stroke();

  context.roundedRect(
    tileSize - pipeHorzOffset - pipeWidth, tileSize - pipeVertOffset,
    tileSize - pipeHorzOffset, tileSize / 2,
    pipeRadius
  );
  context.fill();
  context.stroke();

  // Body
  context.roundedRect(
    horzOffset + trackWidth, vertBodyPadding,
    tileSize - horzOffset - trackWidth, tileSize - vertBodyPadding,
    bodyRadius
  );
  context.fillStyle = bodyColor;
  context.fill();
  context.strokeStyle = 'rgba(0, 0, 0, .3)';
  context.stroke();

  // Arm base
  context.circle(tileSize / 2, tileSize / 2, armBaseRadius);
  context.fillStyle = armBaseColor;
  context.fill();
  context.strokeStyle = 'rgba(0, 0, 0, .1)';
  context.stroke();

  // Arm part style
  context.fillStyle = armColor;
  context.strokeStyle = 'rgba(0, 0, 0, .3)';

  // First arm part
  context.roundedRect(
    (tileSize - firstArmPartWidth) / 2, armStops[0],
    (tileSize + firstArmPartWidth) / 2, armStops[1],
    armPartRadius
  );
  context.fill();
  context.stroke();

  // First arm part
  context.roundedRect(
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
  context.strokeStyle = 'rgba(0, 0, 0, .3)';
  context.stroke();

  context.restore();
}

module.exports = function drawPlayer(level) {
  var {
    direction,
    pulling,
    moving,
    playerPos,
    prevBoxType,
  } = level;
  var [playerX, playerY] = playerPos;
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

  draw(playerX, playerY, direction, moving && pulling);

};
