/*
 * Sobanko
 * https://github.com/fatfisz/sobanko
 *
 * Copyright (c) 2015 FatFisz
 * Licensed under the MIT license.
 */

'use strict';

var { tileSize } = require('../../constants');
var { context } = require('../../utils');
var drawFloor = require('./floor');
var tilePrerender = require('./tile_prerender');


function drawBoxHelper(bumperColor, context) {
  var bumperOffset = 5;
  var bodyColor = '#eee';
  var offset = 4;
  var radius = 5;

  context.fillStyle = bumperColor;
  context.strokeStyle = 'rgba(0, 0, 0, .3)';

  context.roundedRect(bumperOffset * 2, 0, tileSize - bumperOffset * 2, tileSize, bumperOffset);
  context.fill();

  context.roundedRect(0, bumperOffset * 2, tileSize, tileSize - bumperOffset * 2, bumperOffset);
  context.fill();

  context.fillStyle = 'rgba(0, 0, 0, .1)';

  context.roundedRect(bumperOffset * 2, 0, tileSize - bumperOffset * 2, tileSize, bumperOffset);
  context.fill();
  context.stroke();

  context.roundedRect(0, bumperOffset * 2, tileSize, tileSize - bumperOffset * 2, bumperOffset);
  context.fill();
  context.stroke();

  context.roundedRect(offset, offset, tileSize - offset, tileSize - offset, radius);
  context.fillStyle = bodyColor;
  context.fill();
  context.stroke();

  context.strokeStyle = 'rgba(0, 0, 0, .1)';
  context.circle(tileSize / 2, tileSize / 2, tileSize / 2 - bumperOffset * 2);
  context.fillStyle = bumperColor;
  context.fill();
  context.stroke();
}

var box = tilePrerender(drawBoxHelper.bind(null, '#ccc'));
var boxInDestination = tilePrerender(drawBoxHelper.bind(null, '#9cf266'));

module.exports = {

  drawBox(level, x, y, forceOnlyTile) {
    if (!forceOnlyTile) {
      drawFloor(level, x, y);
    }

    context.drawImage(box, x * tileSize, y * tileSize);
  },

  drawBoxInDestination(level, x, y, forceOnlyTile) {
    if (!forceOnlyTile) {
      drawFloor(level, x, y);
    }

    context.drawImage(boxInDestination, x * tileSize, y * tileSize);
  },

};
