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

function updateCounters() {
  $('#boxes-count')[0].textContent = currentLevel.boxesLeft;
  $('#moves-count')[0].textContent = storage.movesStored;
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
  updateCounters();

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
    storage.resetUndo();
    storage.saveLevel(which);
    storage.saveState(currentLevel);
  }
  gameLoop.start(currentLevel);

  initStatus();

  root.className = 'playing';
}

function stopLevel() {
  if (process.env.NODE_ENV !== 'production' && !playing) {
    throw new Error('Already stopped');
  }

  playing = false;
  gameLoop.stop();

  toggleFocus(['undo', 'back', 'restart']);

  root.className = '';
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
  storage.resetUndo();
  storage.clearLevel();
  storage.clearState();
  gameLoop.stop();
  if (best === null || newBest) {
    storage.saveBest(which, moves);
  }

  toggleFocus(['undo', 'back', 'restart']);
  toggleFocus(['back-to-level-select'], true);
  $('#back-to-level-select')[0].focus();

  $('#win-moves-count')[0].textContent = moves;
  $('#win-best')[0].style.display = newBest ? '' : 'none';

  root.className = 'game-won';

  var levelButton = $('.level.continue')[0];

  levelButton.classList.add('solved');
  levelButton.classList.remove('continue');
}

function backToLevelSelect() {
  if (process.env.NODE_ENV !== 'production' && playing) {
    throw new Error('The game should have been stopped');
  }

  toggleFocus(['back-to-level-select']);

  root.className = '';
}

function beforeMove() {
  storage.pushStateFragment(currentLevel);
}

function afterMove() {
  storage.saveState(currentLevel);

  updateCounters();

  if (currentLevel.boxesLeft === 0) {
    gameWon();
  }
}

function undo() {
  currentLevel.undo();
  storage.popStateFragment(currentLevel);
  storage.saveState(currentLevel);
  gameLoop.scheduleRedraw();

  updateCounters();
}

function openRestartDialog() {
  if (process.env.NODE_ENV !== 'production' && !playing) {
    throw new Error('The game shouldn\'t have been stopped');
  }

  toggleFocus(['undo', 'back', 'restart']);
  toggleFocus(['restart-cancel', 'restart-ok'], true);
  $('#restart-ok')[0].focus();

  root.className = 'playing restart-dialog';
}

function resume() {
  if (process.env.NODE_ENV !== 'production' && !playing) {
    throw new Error('The game shouldn\'t have been stopped');
  }

  toggleFocus(['restart-cancel', 'restart-ok']);
  toggleFocus(['undo', 'back', 'restart'], true);

  root.className = 'playing';
}

function restart() {
  if (process.env.NODE_ENV !== 'production' && !playing) {
    throw new Error('The game shouldn\'t have been stopped');
  }

  playing = false;
  storage.clearLevel();
  gameLoop.stop();

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
