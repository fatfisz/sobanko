'use strict';

var assign = require('object-assign');

var { width: canvasWidth, height: canvasHeight, tiles } = require('./constants');
var levels = require('./levels');
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
      controlsState: blankState,
      currentState: blankState,
      pulledBoxState: blankPulledBoxState,
      offsetX: (canvasWidth - width) / 2,
      offsetY: (canvasHeight - height) / 2,
      boxesLeft: 0,
      destinationCount: 0,
    }
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
        case 'destination':
        case 'boxInDestination':
          result.destinationCount += 1;
          break;
      }
    });
  });

  return result;
};
