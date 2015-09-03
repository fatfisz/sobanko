'use strict';

var {
  width: boardWidth,
  height: boardHeight,
  tiles,
} = require('./constants');
var levels = require('./levels');


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

    uiState,
    which,
    data,
    width,
    height,
    direction: null,
    pulling: false,
    moving: false,
    offset: [
      (boardWidth - width) / 2,
      (boardHeight - height) / 2,
    ],
    destinations: [],
  });
};
