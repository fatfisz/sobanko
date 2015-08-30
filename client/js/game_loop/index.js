'use strict';

var clear = require('../draw/clear');
var drawLevelFragment = require('../draw/level_fragment');
var drawPlayer = require('../draw/player');
var drawPulledBox = require('../draw/pulled_box');
var movePlayerAndBox = require('./move_player_and_box');


var redrawScheduled = false;
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

  if (redrawScheduled) {
    drawLevelFragment(level, 0, 0, level.width, level.height);
    drawPlayer(level);
  }

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
  scheduleRedraw();

  clear();

  return stop;
}

function stop() {
  stopped = true;
}

function scheduleRedraw() {
  redrawScheduled = true;
}

module.exports = {
  start,
  stop,
  scheduleRedraw,
};
