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

var root = $('html')[0];
var playing = false;
var currentLevel;

controls.setup(function controlsStateChanged(state) {
  if (!playing) {
    return;
  }

  if (state.special === 'undo') {
    exports.undo();
  }
});

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

module.exports = exports = {

  startLevel(which) {
    if (process.env.NODE_ENV !== 'production' && playing) {
      throw new Error('Already playing');
    }

    playing = true;
    currentLevel = getLevel(which, exports);

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
  },

  stopLevel() {
    if (process.env.NODE_ENV !== 'production' && !playing) {
      throw new Error('Already stopped');
    }

    playing = false;
    gameLoop.stop();

    toggleFocus(['undo', 'back', 'restart']);

    root.className = '';
  },

  backToLevelSelect() {
    if (process.env.NODE_ENV !== 'production' && playing) {
      throw new Error('The game should have been stopped');
    }

    toggleFocus(['back-to-level-select']);

    root.className = '';
  },

  beforeMove() {
    storage.pushStateFragment(currentLevel);
  },

  afterMove() {
    storage.saveState(currentLevel);

    updateCounters();

    if (currentLevel.boxesLeft === 0) {
      gameWon();
    }
  },

  undo() {
    currentLevel.undo();
    storage.popStateFragment(currentLevel);
    storage.saveState(currentLevel);
    gameLoop.scheduleRedraw();

    updateCounters();
  },

  openRestartDialog() {
    if (process.env.NODE_ENV !== 'production' && !playing) {
      throw new Error('The game shouldn\'t have been stopped');
    }

    toggleFocus(['undo', 'back', 'restart']);
    toggleFocus(['restart-cancel', 'restart-ok'], true);
    $('#restart-ok')[0].focus();

    root.className = 'playing restart-dialog';
  },

  resume() {
    if (process.env.NODE_ENV !== 'production' && !playing) {
      throw new Error('The game shouldn\'t have been stopped');
    }

    toggleFocus(['restart-cancel', 'restart-ok']);
    toggleFocus(['undo', 'back', 'restart'], true);

    root.className = 'playing';
  },

  restart() {
    if (process.env.NODE_ENV !== 'production' && !playing) {
      throw new Error('The game shouldn\'t have been stopped');
    }

    playing = false;
    storage.clearLevel();
    gameLoop.stop();

    exports.startLevel(currentLevel.which);

    toggleFocus(['restart-cancel', 'restart-ok']);
  },

};
