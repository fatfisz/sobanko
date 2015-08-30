'use strict';

var clear = require('../draw/clear');
var drawLevelFragment = require('../draw/level_fragment');
var drawPlayer = require('../draw/player');
var drawPulledBox = require('../draw/pulled_box');
var movePlayerAndBox = require('./move_player_and_box');


var timestamp;
var delta;
var level;
var stopped = true;

function step() {
  if (stopped) {
    return;
  }

  requestAnimationFrame(step);

  delta = performance.now() - timestamp;
  timestamp += delta;

  if (level.currentState.direction || level.controlsState.direction) {
    movePlayerAndBox(level, delta);
  }

  if (level.playerMoved) {
    drawPlayer(level);

    if (level.pulledBoxState.direction) {
      drawPulledBox(level);
    }

    level.playerMoved = false;
  }
}

function start(_level) {
  requestAnimationFrame(step);

  timestamp = performance.now();
  level = _level;
  stopped = false;

  clear();
  drawLevelFragment(level, 0, 0, level.width, level.height);
  drawPlayer(level);

  return stop;
}

function stop() {
  stopped = true;
}

module.exports = {
  start,
  stop,
};
