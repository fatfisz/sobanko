'use strict';

var gameLoop = require('./game_loop');
var getLevel = require('./get_level');
var setupControls = require('./setup_controls');
var storage = require('./storage');
var { $ } = require('./utils');


var root = document.querySelectorAll('html')[0];
var playing = false;
var currentLevel;

function controlsStateChanged(controlsState) {
  if (!playing) {
    return;
  }

  if (controlsState.special === 'undo') {
    undo();
  } else {
    currentLevel.move(controlsState);
  }
}

function controlsDetected(type) {
  setupControls(type, controlsStateChanged);
}

function updateMoveCount() {
  $('#moves-count')[0].textContent = storage.movesStored;
}

function updateBoxCount() {
  $('#boxes-count')[0].textContent = currentLevel.boxesLeft;
}

function initStatus() {
  updateMoveCount();
  updateBoxCount();
  $('#destination-count')[0].textContent = currentLevel.destinationCount;
}

function startLevel(which) {
  if (process.env.NODE_ENV !== 'production' && playing) {
    throw new Error('Already playing');
  }

  playing = true;
  currentLevel = getLevel(which, module.exports);

  if (storage.savedLevel === which) {
    storage.restoreState(currentLevel);
  } else {
    storage.resetUndo();
    storage.saveLevel(which);
    storage.pushState(currentLevel);
  }

  initStatus();
  gameLoop.start(currentLevel);

  root.className = 'playing';
}

function stopLevel() {
  if (process.env.NODE_ENV !== 'prodcution' && !playing) {
    throw new Error('Already stopped');
  }

  playing = false;
  gameLoop.stop();

  root.className = '';
}

function gameWon() {
  if (process.env.NODE_ENV !== 'prodcution' && !playing) {
    throw new Error('Already stopped');
  }

  var moves = storage.movesStored;

  playing = false;
  storage.clearLevel();
  storage.resetUndo();
  gameLoop.stop();

  $('#win-moves-count')[0].textContent = moves;

  root.className = 'game-won';
}

function backToLevelSelect() {
  if (process.env.NODE_ENV !== 'prodcution' && playing) {
    throw new Error('The game should have been stopped');
  }

  root.className = '';
}

function moveFinished() {
  storage.pushState(currentLevel);
  updateMoveCount(storage.movesStored);
  updateBoxCount(currentLevel);

  if (currentLevel.boxesLeft === 0) {
    gameWon();
  }
}

function undo() {
  var isMoving = currentLevel.currentState.direction;

  currentLevel.undo();
  storage[isMoving ? 'restoreState' : 'popState'](currentLevel);
  gameLoop.scheduleRedraw();

  updateMoveCount(storage.movesStored);
}

module.exports = {
  controlsDetected,
  startLevel,
  stopLevel,
  backToLevelSelect,
  moveFinished,
  undo,
};
