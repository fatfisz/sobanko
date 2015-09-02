'use strict';

var controls = require('./controls');
var gameLoop = require('./game_loop');
var getLevel = require('./get_level');
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

  allowFocus('undo');
  allowFocus('back');
  allowFocus('restart');

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

  blockFocus('undo');
  blockFocus('back');
  blockFocus('restart');
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

  allowFocus('back-to-level-select');

  $('#back-to-level-select')[0].focus();

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
  if (process.env.NODE_ENV !== 'production' && playing) {
    throw new Error('The game should have been stopped');
  }

  root.className = '';

  blockFocus('back-to-level-select');
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

  blockFocus('undo');
  blockFocus('back');
  blockFocus('restart');
  allowFocus('restart-cancel');
  allowFocus('restart-ok');

  $('#restart-ok')[0].focus();
}

function resume() {
  if (process.env.NODE_ENV !== 'production' && !playing) {
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
  if (process.env.NODE_ENV !== 'production' && !playing) {
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
