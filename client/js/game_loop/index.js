/*
 * Sobanko
 * https://github.com/fatfisz/sobanko
 *
 * Copyright (c) 2015 FatFisz
 * Licensed under the MIT license.
 */

'use strict';

var clear = require('../draw/clear');
var drawLevelFragment = require('../draw/level_fragment');
var drawPlayer = require('../draw/player');
var movePlayerAndBox = require('./move_player_and_box');


var stopped = true;
var redrawScheduled = false;
var timestamp;
var delta;
var level;

function step() {
  if (stopped) {
    return;
  }

  requestAnimationFrame(step);

  delta = performance.now() - timestamp;
  timestamp += delta;

  if (redrawScheduled) {
    drawLevelFragment(level, 0, 0, level.width, level.height);
    drawPlayer(level);
    redrawScheduled = false;
  }

  if (movePlayerAndBox(level, delta)) {
    drawPlayer(level);
  }
}

module.exports = exports = {

  start(_level) {
    requestAnimationFrame(step);

    stopped = false;
    timestamp = performance.now();
    level = _level;
    exports.scheduleRedraw();

    clear();
  },

  stop() {
    stopped = true;
  },

  scheduleRedraw() {
    redrawScheduled = true;
  },

};
