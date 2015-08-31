'use strict';

var canvasResizer = require('./canvas_resizer');
var { width, height, tileSize } = require('../constants');
var levels = require('../levels');
var state = require('../state');
var storage = require('../storage');
var { $ } = require('../utils');


// Setup the canvas
var canvas = $('canvas')[0];
var resizeCanvas = canvasResizer(canvas);

canvas.width = width * tileSize;
canvas.height = height * tileSize;

resizeCanvas();
window.onresize = resizeCanvas;

// Setup levels
var levelsContainer = $('#levels')[0];
var levelsFragment = document.createDocumentFragment();
var levelContinue = storage.level;
var levelBox;

for (var i = 0, ii = levels.length; i < ii; i += 1) {
  levelBox = document.createElement('div');
  levelBox.className =
    'level' +
    (i === levelContinue ? ' continue' : '') +
    (storage.getBest(i) !== null ? ' solved' : '');
  levelBox.onclick = state.startLevel.bind(null, i);
  levelBox.textContent = i + 1;
  levelsFragment.appendChild(levelBox);
}

levelsContainer.appendChild(levelsFragment);

// Setup the Undo button
$('#undo')[0].onclick = state.undo;

// Setup the Back buttons
$('#back')[0].onclick = state.stopLevel;

$('#back-to-level-select')[0].onclick = state.backToLevelSelect;
