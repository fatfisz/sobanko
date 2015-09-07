/*
 * Sobanko
 * https://github.com/fatfisz/sobanko
 *
 * Copyright (c) 2015 FatFisz
 * Licensed under the MIT license.
 */

'use strict';

var { drawBox, drawBoxInDestination } = require('./tiles/boxes');


var drawingFunctions = [
  null,
  require('./tiles/wall'),
  require('./tiles/floor'),
  drawBox,
  require('./tiles/destination'),
  drawBoxInDestination,
];

module.exports = function drawTile(level, pos, _tile) {
  var tile = _tile;
  var [x, y] = pos;

  if (!tile) {
    tile = level.getTile(pos);
  }

  if (!drawingFunctions[tile]) {
    return;
  }

  drawingFunctions[tile](level, x, y, _tile); // pass the tile if it was provided
};
