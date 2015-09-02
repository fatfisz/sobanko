'use strict';

var controls = require('./controls');
var gameLoop = require('./game_loop');
var getLevel = require('./get_level');
var storage = require('./storage');
var { $ } = require('./utils');


function toggleFocus(ids, allow) {
  ids.forEach((id) => {
    $('#' + id)[0].tabIndex = allow ? 0 : -1;
  });
}

var root = document.querySelectorAll('html')[0];
var playing = false;
var currentLevel;

function controlsStateChanged(state) {
  if (!playing) {
    return;
  }

  if (state.special === 'undo') {
    undo();
  }
}

controls.setup(controlsStateChanged);

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

  toggleFocus(['undo', 'back', 'restart'], true);

  $('#destination-count')[0].textContent = currentLevel.destinations.length;
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

  if (storage.getLevel() === which) {
    storage.restoreState(currentLevel);
  } else {
    storage.saveState(currentLevel);
    storage.resetUndo();
    storage.saveLevel(which);
  }

  initStatus();

  gameLoop.start(currentLevel);

  root.className = 'playing';
}

function stopLevel() {
  if (process.env.NODE_ENV !== 'production' && !playing) {
    throw new Error('Already stopped');
  }

  playing = false;
  gameLoop.stop();

  root.className = '';

  toggleFocus(['undo', 'back', 'restart']);
}

function gameWon() {
  if (process.env.NODE_ENV !== 'production' && !playing) {
    throw new Error('Already stopped');
  }

  var { which } = currentLevel;
  var moves = storage.movesStored;
  var best = storage.getBest(which);
  var newBest = moves < best;

  playing = false;
  storage.clearState();
  storage.resetUndo();
  storage.clearLevel();
  gameLoop.stop();
  if (best === null || newBest) {
    storage.saveBest(which, moves);
  }

  toggleFocus(['back-to-level-select'], true);

  $('#back-to-level-select')[0].focus();

  $('#win-moves-count')[0].textContent = moves;
  $('#win-best')[0].style.display = newBest ? '' : 'none';

  root.className = 'game-won';

  toggleFocus(['undo', 'back', 'restart']);

  var levelButton = $('.level.continue')[0];

  levelButton.classList.add('solved');
  levelButton.classList.remove('continue');
}

function backToLevelSelect() {
  if (process.env.NODE_ENV !== 'production' && playing) {
    throw new Error('The game should have been stopped');
  }

  root.className = '';

  toggleFocus(['back-to-level-select']);
}

function beforeMove() {
  storage.pushStateFragment(currentLevel);
}

function afterMove() {
  storage.saveState(currentLevel);

  updateMoveCount(storage.movesStored);
  updateBoxCount(currentLevel);

  if (currentLevel.boxesLeft === 0) {
    gameWon();
  }
}

function undo() {
  currentLevel.undo();
  storage.popStateFragment(currentLevel);
  storage.saveState(currentLevel);
  gameLoop.scheduleRedraw();

  updateMoveCount(storage.movesStored);
  updateBoxCount(currentLevel);
}

function openRestartDialog() {
  if (process.env.NODE_ENV !== 'production' && !playing) {
    throw new Error('The game shouldn\'t have been stopped');
  }

  root.className = 'playing restart-dialog';

  toggleFocus(['undo', 'back', 'restart']);
  toggleFocus(['restart-cancel', 'restart-ok'], true);

  $('#restart-ok')[0].focus();
}

function resume() {
  if (process.env.NODE_ENV !== 'production' && !playing) {
    throw new Error('The game shouldn\'t have been stopped');
  }

  root.className = 'playing';

  toggleFocus(['undo', 'back', 'restart'], true);
  toggleFocus(['restart-cancel', 'restart-ok']);
}

function restart() {
  if (process.env.NODE_ENV !== 'production' && !playing) {
    throw new Error('The game shouldn\'t have been stopped');
  }

  playing = false;
  gameLoop.stop();
  storage.clearLevel();

  startLevel(currentLevel.which);

  toggleFocus(['restart-cancel', 'restart-ok']);
}

module.exports = {
  startLevel,
  stopLevel,
  backToLevelSelect,
  beforeMove,
  afterMove,
  undo,
  openRestartDialog,
  resume,
  restart,
};
