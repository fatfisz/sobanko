/*
 * Sobanko
 * https://github.com/fatfisz/sobanko
 *
 * Copyright (c) 2015 FatFisz
 * Licensed under the MIT license.
 */

'use strict';

var { tileSize } = require('../constants');
var { context } = require('../utils');
var drawTile = require('./tile');


module.exports = function drawLevelFragment(level, x, y, width, height) {
  context.clearRect(x * tileSize, y * tileSize, width * tileSize, height * tileSize);

  for (var ty = y; ty < y + height; ty += 1) {
    for (var tx = x; tx < x + width; tx += 1) {
      if (tx < 0 || ty < 0 || tx >= level.width || ty >= level.height) {
        continue;
      }

      drawTile(level, [tx, ty]);
    }
  }
};
