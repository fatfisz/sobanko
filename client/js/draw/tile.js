'use strict';

var { tileSize } = require('../constants');
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
  var { data, offset } = level;
  var tile = _tile;
  var [offsetX, offsetY] = offset;
  var [x, y] = pos;

  if (!tile) {
    tile = level.getTile(pos);
  }

  if (!drawingFunctions[tile]) {
    return;
  }

  drawingFunctions[tile](
    (offsetX + x) * tileSize,
    (offsetY + y) * tileSize,
    data,
    x,
    y,
    _tile // pass the tile if it was provided
  );
};
