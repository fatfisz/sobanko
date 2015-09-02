'use strict';

var assign = require('object-assign');

var { isBoxTile, getBoxPosition } = require('./utils');


var undoPrefix = 'undo/';
var bestPrefix = 'best/';

var stateIndex = +localStorage.getItem('stateIndex');

function saveLevel(which) {
  localStorage.setItem('level', which);
}

function getLevel() {
  var level = localStorage.getItem('level');

  return level === null ? null : +level;
}

function clearLevel() {
  localStorage.removeItem('level');
}

function updateStateIndex() {
  localStorage.setItem('stateIndex', stateIndex);
}

function resetUndo() {
  var keysToDelete = [];

  for (var i = 0, ii = localStorage.length; i < ii; i += 1) {
    if (localStorage.key(i).startsWith(undoPrefix)) {
      keysToDelete.push(localStorage.key(i));
    }
  }

  keysToDelete.forEach((key) => {
    localStorage.removeItem(key);
  });

  stateIndex = 0;
  updateStateIndex();
}

function encodeState(level) {
  var { data, playerX, playerY } = level;

  return JSON.stringify({
    data,
    playerX,
    playerY,
  });
}

function applyState(level, value) {
  var parsed = JSON.parse(value);

  assign(level, parsed);
}

function encodeStateFragment(level) {
  var { data, direction, pulling, playerX, playerY } = level;
  var savedState = [
    playerX,
    playerY,
  ];

  if (pulling) {
    var [boxX, boxY] = getBoxPosition(direction, playerX, playerY);

    if (isBoxTile(data[boxY][boxX])) {
      savedState.push(
        [playerX, playerY, data[playerY][playerX]],
        [boxX, boxY, data[boxY][boxX]]
      );
    }
  }

  return JSON.stringify(savedState);
}

function applyStateFragment(level, value) {
  var parsed = JSON.parse(value);
  var [
    playerX,
    playerY,
    /* eslint-disable comma-dangle */
    ...data // This is a bug in eslint
    /* eslint-enable comma-dangle */
  ] = parsed;

  data.forEach((tileData) => {
    var [x, y, tile] = tileData;

    level.data[y][x] = tile;
  });

  assign(level, {
    playerX,
    playerY,
  });
}

function saveState(level) {
  localStorage.setItem('lastState', encodeState(level));
}

function restoreState(level) {
  var savedState = localStorage.getItem('lastState');

  applyState(level, savedState);
}

function clearState() {
  localStorage.removeItem('lastState');
}

function pushStateFragment(level) {
  localStorage.setItem(undoPrefix + stateIndex, encodeStateFragment(level));
  stateIndex += 1;
  updateStateIndex();
}

function popStateFragment(level) {
  if (stateIndex === 0) {
    return;
  }

  stateIndex -= 1;
  updateStateIndex();

  var savedState = localStorage.getItem(undoPrefix + stateIndex);

  localStorage.removeItem(undoPrefix + stateIndex);
  applyStateFragment(level, savedState);
}

function saveBest(which, moves) {
  localStorage.setItem(bestPrefix + which, moves);
}

function getBest(which) {
  var best = localStorage.getItem(bestPrefix + which);

  return best === null ? null : +best;
}

module.exports = {
  saveLevel,
  getLevel,
  clearLevel,

  resetUndo,

  saveState,
  restoreState,
  clearState,

  pushStateFragment,
  popStateFragment,

  saveBest,
  getBest,

  get movesStored() {
    return stateIndex;
  },

};
