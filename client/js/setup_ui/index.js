'use strict';

require('./levels');

var canvasResizer = require('./canvas_resizer');
var { width, height, tileSize } = require('../constants');
var state = require('../state');
var { $ } = require('../utils');


// Setup the canvas
var canvas = $('canvas')[0];
var resizeCanvas = canvasResizer(canvas);

canvas.width = width * tileSize;
canvas.height = height * tileSize;

resizeCanvas();
window.onresize = resizeCanvas;

// Setup the Undo button
$('#undo')[0].onclick = state.undo;

// Setup the Back buttons
$('#back')[0].onclick = state.stopLevel;

$('#back-to-level-select')[0].onclick = state.backToLevelSelect;
