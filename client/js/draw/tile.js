'use strict';

var { tileSize } = require('../constants');


var drawingFunctions = [
  null,
  require('./tiles/wall'),
  require('./tiles/floor'),
  require('./tiles/box'),
  require('./tiles/destination'),
  require('./tiles/box_in_destination'),
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
