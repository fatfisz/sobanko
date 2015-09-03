'use strict';

var assign = require('object-assign');

var { isBoxTile, getBoxPosition } = require('./utils');


var undoPrefix = 'undo/';
var bestPrefix = 'best/';

var stateIndex = +localStorage.getItem('stateIndex');

function updateStateIndex() {
  localStorage.setItem('stateIndex', stateIndex);
}

function encodeState(level) {
  var { data, playerPos } = level;

  return JSON.stringify({
    data,
    playerPos,
  });
}

function applyState(level, value) {
  var parsed = JSON.parse(value);

  assign(level, parsed);
}

function encodeStateFragment(level) {
  var { direction, pulling, playerPos } = level;
  var savedState = [playerPos];

  if (pulling) {
    var boxPos = getBoxPosition(direction, playerPos);

    if (isBoxTile(level.getTile(boxPos))) {
      savedState.push(
        [playerPos, level.getTile(playerPos)],
        [boxPos, level.getTile(boxPos)]
      );
    }
  }

  return JSON.stringify(savedState);
}

function applyStateFragment(level, value) {
  var parsed = JSON.parse(value);
  var [
    playerPos,
    /* eslint-disable comma-dangle */
    ...data // This is a bug in eslint
    /* eslint-enable comma-dangle */
  ] = parsed;

  data.forEach((tileData) => {
    var [pos, tile] = tileData;

    level.setTile(pos, tile);
  });

  level.playerPos = playerPos;
}

module.exports = {

  get movesStored() {
    return stateIndex;
  },

  saveLevel(which) {
    localStorage.setItem('level', which);
  },

  getLevel() {
    var level = localStorage.getItem('level');

    return level === null ? null : +level;
  },

  clearLevel() {
    localStorage.removeItem('level');
  },

  resetUndo() {
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
  },

  saveState(level) {
    localStorage.setItem('lastState', encodeState(level));
  },

  restoreState(level) {
    var savedState = localStorage.getItem('lastState');

    applyState(level, savedState);
  },

  clearState() {
    localStorage.removeItem('lastState');
  },

  pushStateFragment(level) {
    localStorage.setItem(undoPrefix + stateIndex, encodeStateFragment(level));
    stateIndex += 1;
    updateStateIndex();
  },

  popStateFragment(level) {
    if (stateIndex === 0) {
      return;
    }

    stateIndex -= 1;
    updateStateIndex();

    var savedState = localStorage.getItem(undoPrefix + stateIndex);

    localStorage.removeItem(undoPrefix + stateIndex);
    applyStateFragment(level, savedState);
  },

  saveBest(which, moves) {
    localStorage.setItem(bestPrefix + which, moves);
  },

  getBest(which) {
    var best = localStorage.getItem(bestPrefix + which);

    return best === null ? null : +best;
  },

};
