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

// Setup the undo button
var undo = $('#undo')[0];

undo.onclick = () => {
  state.undo();
};
