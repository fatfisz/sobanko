'use strict';

var controls = require('./controls');
var gameLoop = require('./game_loop');
var getLevel = require('./get_level');
var levels = require('./levels');
var resizeCanvas = require('./resize_canvas');
var storage = require('./storage');
var { $ } = require('./utils');


function toggleFocus(ids, allow) {
  ids.forEach((id) => {
    var element = $('#' + id)[0];

    element.tabIndex = allow ? 0 : -1;
    element.blur();
  });
}

var root = $('html')[0];
var playing = false;
var currentLevel;

controls.setup(function controlsStateChanged() {
  if (!playing) {
    return;
  }

  if (controls.state.special === 'undo') {
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

  $('#best')[0].classList[best === null ? 'add' : 'remove']('hidden');
  $('#best-count')[0].textContent = best;
}

function gameWon() {
  if (process.env.NODE_ENV !== 'production' && !playing) {
    throw new Error('The game shouldn\'t have been stopped');
  }

  var { which } = currentLevel;
  var moves = storage.movesStored;
  var best = storage.getBest(which);
  var newBest = moves < best;
  var nextLevelButton = $('#next-level')[0];

  playing = false;
  storage.resetUndo();
  storage.clearLevel();
  storage.clearState();
  gameLoop.stop();
  if (best === null || newBest) {
    storage.saveBest(which, moves);
  }

  toggleFocus(['undo', 'back', 'restart']);
  toggleFocus(['back-to-level-select', 'next-level'], true);
  if (levels[which + 1]) {
    nextLevelButton.className = '';
    nextLevelButton.focus();
  } else {
    $('#back-to-level-select')[0].focus();
    nextLevelButton.className = 'hidden';
  }

  $('#win-moves-count')[0].textContent = moves;
  $('#win-best')[0].className = newBest ? '' : 'hidden';

  root.classList.remove('playing');
  root.classList.add('game-won');

  var levelButton = $('.level.continue')[0];

  levelButton.classList.add('solved');
  levelButton.classList.remove('continue');
}

module.exports = exports = {

  startLevel(which) {
    if (playing) { // this can happen if user clicked too fast
      return;
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

    root.classList.add('playing');

    resizeCanvas();
  },

  stopLevel() {
    if (!playing) { // this can happen if user clicked too fast
      return;
    }

    playing = false;
    gameLoop.stop();

    toggleFocus(['undo', 'back', 'restart']);

    root.classList.remove('playing');
  },

  backToLevelSelect() {
    if (playing) { // this can happen if user clicked too fast
      return;
    }

    toggleFocus(['back-to-level-select', 'next-level']);

    root.classList.remove('game-won');
  },

  startNextLevel() {
    if (playing) { // this can happen if user clicked too fast
      return;
    }

    root.classList.remove('game-won');

    exports.startLevel(currentLevel.which + 1);

    toggleFocus(['back-to-level-select', 'next-level']);
  },

  saveState() {
    storage.saveState(currentLevel);
  },

  beforeMove() {
    storage.pushStateFragment(currentLevel);
  },

  afterMove() {
    exports.saveState();

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

    root.classList.add('restart-dialog');
  },

  resume() {
    if (process.env.NODE_ENV !== 'production' && !playing) {
      throw new Error('The game shouldn\'t have been stopped');
    }

    toggleFocus(['restart-cancel', 'restart-ok']);
    toggleFocus(['undo', 'back', 'restart'], true);

    root.classList.remove('restart-dialog');
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

    root.classList.remove('restart-dialog');
  },

};
