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
var firstFrame;
var lastTimestamp;
var delta;
var level;

function step(timestamp) {
  if (stopped) {
    return;
  }

  requestAnimationFrame(step);

  if (firstFrame) {
    lastTimestamp = timestamp;
    firstFrame = false;
  }

  delta = timestamp - lastTimestamp;
  lastTimestamp = timestamp;

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
    firstFrame = true;
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
