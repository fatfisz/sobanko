/*
 * Sobanko
 * https://github.com/fatfisz/sobanko
 *
 * Copyright (c) 2015 FatFisz
 * Licensed under the MIT license.
 */

'use strict';

var {
  width: canvasWidth,
  height: canvasHeight,
  tileSize,
  tiles,
} = require('./constants');
var levels = require('./levels');
var { context } = require('./utils');


function processData(level) {
  level.data = level.data.map((row, y) => {
    return row.map((value, x) => {
      switch (tiles[value]) {
        case 'destination':
        case 'boxInDestination':
          level.destinations.push([x, y]);
          break;
        case 'player':
          level.playerPos = [x, y];
          return tiles.floor; // replace player with a floor
      }

      return value;
    });
  });

  return level;
}

module.exports = function getLevel(which, uiState) {
  var data = levels[which];
  var width = data[0].length;
  var height = data.length;

  // Center the board on the canvas
  context.setTransform(
    1,
    0,
    0,
    1,
    (canvasWidth - width) / 2 * tileSize,
    (canvasHeight - height) / 2 * tileSize
  );

  return processData({

    get boxesLeft() {
      return this.destinations.reduce(
        (acc, pos) => acc + (tiles[this.getTile(pos)] === 'destination'),
        0
      );
    },

    getTile([x, y]) {
      return this.data[y][x];
    },

    setTile([x, y], tile) {
      this.data[y][x] = tile;
    },

    undo() {
      this.moving = false;
    },

    reset() {
      this.data = levels[which];
      this.direction = null;
      this.pulling = false;
      this.moving = false;
      this.destinations = [];
      processData(this);
    },

    uiState,
    which,
    data,
    width,
    height,
    direction: null,
    pulling: false,
    moving: false,
    destinations: [],
  });
};
