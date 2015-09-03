'use strict';

var assign = require('object-assign');

var {
  width: boardWidth,
  height: boardHeight,
  tiles,
} = require('./constants');
var levels = require('./levels');


var LevelPrototype = {

  get boxesLeft() {
    return this.destinations.reduce((acc, pos) => {
      var tile = this.getTile(pos);
      var shouldCount = tiles[tile] === 'destination';

      return acc + (shouldCount ? 1 : 0);
    }, 0);
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

};

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
          return tiles.floor;
      }

      return value;
    });
  });
}

module.exports = function getLevel(which, uiState) {
  var data = levels[which];
  var width = data[0].length;
  var height = data.length;

  var result = assign(
    Object.create(LevelPrototype),
    {
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
    }
  );

  processData(result);

  return result;
};
