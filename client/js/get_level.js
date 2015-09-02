'use strict';

var assign = require('object-assign');

var { width: canvasWidth, height: canvasHeight, tiles } = require('./constants');
var levels = require('./levels');
var { getTileFromName } = require('./utils');


var getBlankState = () => ({
  direction: null,
  pulling: false,
});

var LevelPrototype = {

  move(controlsState) {
    this.controlsState = controlsState;
  },

  undo() {
    this.controlsState = getBlankState();
    this.playerMoving = false;
  },

};

function processData(level) {
  level.data.map((row, y) => {
    return row.map((value, x) => {
      switch (tiles[value]) {
        case 'box':
          level.boxesLeft += 1;
          break;
        case 'destination':
        case 'boxInDestination':
          level.destinationCount += 1;
          break;
        case 'player':
          assign(level, { playerX: x, playerY: y });
          level.data[y][x] = getTileFromName('floor');
          break;
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
      controlsState: getBlankState(),
      currentState: getBlankState(),
      playerMoving: false,
      offsetX: (canvasWidth - width) / 2,
      offsetY: (canvasHeight - height) / 2,
      boxesLeft: 0,
      destinationCount: 0,
    }
  );

  processData(result);

  return result;
};
