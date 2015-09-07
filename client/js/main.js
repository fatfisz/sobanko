/*
 * Sobanko
 * https://github.com/fatfisz/sobanko
 *
 * Copyright (c) 2015 FatFisz
 * Licensed under the MIT license.
 */

'use strict';

var { width, height, tileSize } = require('./constants');
var events = require('./events');
var levels = require('./levels');
var resizeCanvas = require('./resize_canvas');
var state = require('./state');
var storage = require('./storage');
var { $ } = require('./utils');


function setupButton(element, handler) {
  element.tabIndex = -1;

  events
    .on(element, 'click', handler)
    .on(element, 'touchstart', () => {
      element.classList.add('active');
    })
    .on(element, 'touchend', () => {
      element.classList.remove('active');
    });
}

// Setup the canvas
var canvas = $('canvas')[0];

canvas.width = width * tileSize;
canvas.height = height * tileSize;

window.onresize = resizeCanvas;

// Setup levels
var levelContinue = storage.getLevel();

levels.forEach((level, i) => {
  var levelBox = document.createElement('button');

  levelBox.className =
    'level' +
    (i === levelContinue ? ' continue' : '') +
    (storage.getBest(i) !== null ? ' solved' : '');
  levelBox.textContent = i + 1;

  setupButton(levelBox, state.startLevel.bind(null, i));

  $('#levels')[0].appendChild(levelBox);
});

// Setup the Info buttons
setupButton($('#undo')[0], state.undo);
setupButton($('#restart')[0], state.openRestartDialog);
setupButton($('#back')[0], state.stopLevel);

// Setup the Restart dialog buttons
setupButton($('#restart-cancel')[0], state.resume);
setupButton($('#restart-ok')[0], state.restart);

// Setup the Game Won screen buttons
setupButton($('#back-to-level-select')[0], state.backToLevelSelect);
setupButton($('#next-level')[0], state.startNextLevel);
