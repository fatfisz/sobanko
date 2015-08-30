'use strict';

var assign = require('object-assign');

var { width: canvasWidth, height: canvasHeight, tiles } = require('./constants');
var { getTileFromName } = require('./utils');


var blankState = {
  direction: null,
  pulling: false,
};

function cloneData(level) {
  level.data = level.data.map((row) => row.slice()); // clone rows
}

var LevelPrototype = {

  move(controlsState) {
    this.controlsState = controlsState;
  },

};

module.exports = function processLevel(level, uiState) {
  var result = assign(
    Object.create(LevelPrototype),
    {
      uiState,
      pulledBox: {
        direction: null,
        type: null,
      },
      currentState: blankState,
      controlsState: blankState,
      offsetX: (canvasWidth - level.width) / 2,
      offsetY: (canvasHeight - level.height) / 2,
      playerMoved: true, // force first draw
      boxesLeft: 0,
    },
    level
  );

  cloneData(result);

  result.data.forEach((row, y) => {
    row.forEach((value, x) => {
      switch (tiles[value]) {
        case 'player':
          assign(result, { playerX: x, playerY: y });
          result.data[y][x] = getTileFromName('floor');
          break;
        case 'box':
          result.boxesLeft += 1;
          break;
      }
    });
  });

  return result;
};
