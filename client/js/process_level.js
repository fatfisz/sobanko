'use strict';

var assign = require('object-assign');

var { width: canvasWidth, height: canvasHeight, tiles } = require('./constants');
var { getTileFromName } = require('./utils');


var blankState = {
  direction: null,
  pulling: false,
};
var blankPulledBoxState = {
  direction: null,
  type: null,
};

function cloneData(level) {
  level.data = level.data.map((row) => row.slice()); // clone rows
}

var LevelPrototype = {

  move(controlsState) {
    this.controlsState = controlsState;
  },

  setCurrentState(state) {
    this.currentState = assign({}, state);
  },

  clearCurrentState() {
    this.currentState = blankState;
  },

  setPulledBoxState(state) {
    this.pulledBoxState = assign({}, state);
  },

  clearPulledBoxState() {
    this.pulledBoxState = blankPulledBoxState;
  },

  undo() {
    this.controlsState = blankState;
    this.currentState = blankState;
    this.pulledBoxState = blankPulledBoxState;
  },

};

module.exports = function processLevel(level, uiState) {
  var result = assign(
    Object.create(LevelPrototype),
    {
      uiState,
      controlsState: blankState,
      currentState: blankState,
      pulledBoxState: blankPulledBoxState,
      playerMoved: false,
      offsetX: (canvasWidth - level.width) / 2,
      offsetY: (canvasHeight - level.height) / 2,
      boxesLeft: 0,
    },
    level
  );

  // Clone data so that the levels remain unchanged
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
