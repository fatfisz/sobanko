'use strict';

var assign = require('object-assign');


var undoPrefix = 'undo/';
var bestPrefix = 'best/';

var stateIndex = +localStorage.getItem('stateIndex');

function saveLevel(which) {
  localStorage.setItem('level', which);
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
  var { data, boxesLeft, playerX, playerY } = level;

  return JSON.stringify({
    data,
    boxesLeft,
    playerX,
    playerY,
  });
}

function decodeState(value) {
  return JSON.parse(value);
}

function pushState(level) {
  localStorage.setItem(undoPrefix + stateIndex, encodeState(level));
  stateIndex += 1;
  updateStateIndex();
}

function restoreState(level) {
  var decodedState = decodeState(localStorage.getItem(undoPrefix + (stateIndex - 1)));

  assign(level, decodedState);
}

function popState(level) {
  if (stateIndex === 1) {
    return;
  }

  stateIndex -= 1;
  updateStateIndex();
  localStorage.removeItem(undoPrefix + stateIndex);

  restoreState(level);
}

function getBest(which) {
  var best = localStorage.getItem(bestPrefix + which);

  return best === null ? null : +best;
}

function saveBest(which, moves) {
  localStorage.setItem(bestPrefix + which, moves);
}

module.exports = {
  saveLevel,
  clearLevel,
  resetUndo,
  pushState,
  restoreState,
  popState,
  getBest,
  saveBest,

  get movesStored() {
    return stateIndex - 1;
  },

  get level() {
    var level = localStorage.getItem('level');

    return level === null ? null : +level;
  },

};
