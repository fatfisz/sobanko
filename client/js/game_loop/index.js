'use strict';

var controls = require('../controls');
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

  if (level.moving || controls.state.direction) {
    if (movePlayerAndBox(level, delta)) {
      drawPlayer(level);
    }
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
