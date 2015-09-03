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
  var { offset } = level;
  var [offsetX, offsetY] = offset;
  var tile = _tile;
  var [x, y] = pos;

  if (!tile) {
    tile = level.getTile(pos);
  }

  if (!drawingFunctions[tile]) {
    return;
  }

  drawingFunctions[tile](
    level,
    x,
    y,
    (offsetX + x) * tileSize,
    (offsetY + y) * tileSize,
    _tile // pass the tile if it was provided
  );
};
