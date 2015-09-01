'use strict';

var gameLoop = require('./game_loop');
var getLevel = require('./get_level');
var setupControls = require('./setup_controls');
var storage = require('./storage');
var { $ } = require('./utils');


function allowFocus(id) {
  $('#' + id)[0].tabIndex = 0;
}

function blockFocus(id) {
  $('#' + id)[0].tabIndex = -1;
}

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
  setTimeout(() => {
    var currentContinue = $('.level.continue')[0];

    if (currentContinue) {
      currentContinue.classList.remove('continue');
    }

    $('.level')[currentLevel.which].classList.add('continue');
  }, 500);

  allowFocus('undo');
  allowFocus('back');
  allowFocus('restart');

  $('#destination-count')[0].textContent = currentLevel.destinationCount;
  updateBoxCount();
  updateMoveCount();

  var best = storage.getBest(currentLevel.which);

  $('#best')[0].style.display = best === null ? 'none' : '';
  $('#best-count')[0].textContent = best;
}

function startLevel(which) {
  if (process.env.NODE_ENV !== 'production' && playing) {
    throw new Error('Already playing');
  }

  playing = true;
  currentLevel = getLevel(which, module.exports);

  if (storage.level === which) {
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

  blockFocus('undo');
  blockFocus('back');
  blockFocus('restart');
}

function gameWon() {
  if (process.env.NODE_ENV !== 'prodcution' && !playing) {
    throw new Error('Already stopped');
  }

  var { which } = currentLevel;
  var moves = storage.movesStored;
  var best = storage.getBest(which);
  var newBest = moves < best;

  playing = false;
  storage.clearLevel();
  storage.resetUndo();
  gameLoop.stop();
  if (best === null || newBest) {
    storage.saveBest(which, moves);
  }

  allowFocus('back-to-level-select');

  $('#win-moves-count')[0].textContent = moves;
  $('#win-best')[0].style.display = newBest ? '' : 'none';

  root.className = 'game-won';

  blockFocus('undo');
  blockFocus('back');
  blockFocus('restart');

  var levelButton = $('.level.continue')[0];

  levelButton.classList.add('solved');
  levelButton.classList.remove('continue');
}

function backToLevelSelect() {
  if (process.env.NODE_ENV !== 'prodcution' && playing) {
    throw new Error('The game should have been stopped');
  }

  root.className = '';

  blockFocus('back-to-level-select');
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

function openRestartDialog() {
  if (process.env.NODE_ENV !== 'prodcution' && !playing) {
    throw new Error('The game shouldn\'t have been stopped');
  }

  root.className = 'playing restart-dialog';

  blockFocus('undo');
  blockFocus('back');
  blockFocus('restart');
  allowFocus('restart-cancel');
  allowFocus('restart-ok');

  $('#restart-ok')[0].focus();
}

function resume() {
  if (process.env.NODE_ENV !== 'prodcution' && !playing) {
    throw new Error('The game shouldn\'t have been stopped');
  }

  root.className = 'playing';

  allowFocus('undo');
  allowFocus('back');
  allowFocus('restart');
  blockFocus('restart-cancel');
  blockFocus('restart-ok');
}

function restart() {
  if (process.env.NODE_ENV !== 'prodcution' && !playing) {
    throw new Error('The game shouldn\'t have been stopped');
  }

  playing = false;
  gameLoop.stop();
  storage.clearLevel();

  startLevel(currentLevel.which);

  blockFocus('restart-cancel');
  blockFocus('restart-ok');
}

module.exports = {
  controlsDetected,
  startLevel,
  stopLevel,
  backToLevelSelect,
  moveFinished,
  undo,
  openRestartDialog,
  resume,
  restart,
};
