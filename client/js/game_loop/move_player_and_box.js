'use strict';

var assign = require('object-assign');

var { playerSpeed } = require('../constants');
var controls = require('../controls');
var {
  isPassable,
  directionToIndex,
  directionToDirectionMod,
  getTargetPosition,
} = require('../utils');
var boxPulling = require('./box_pulling');


function movePlayer(level, delta) {
  var { uiState, direction, pulling, playerPos, targetPos } = level;
  var posindex = directionToIndex[direction];
  var directionMod = directionToDirectionMod[direction];
  var mod = delta * playerSpeed;

  playerPos[posindex] += mod * directionMod;

  // Did we move past the target?
  if (directionMod * (playerPos[posindex] - targetPos[posindex]) > 0) {
    playerPos[posindex] = targetPos[posindex];
    level.moving = false;

    if (pulling) {
      boxPulling.stop(level);
    }

    uiState.afterMove();
  }
}

module.exports = function movePlayerAndBox(level, delta) {
  var { moving, playerPos } = level;

  if (!moving) {
    var { direction, pulling } = controls.state;

    assign(level, {
      direction,
      pulling,
    });

    if (process.env.NODE_ENV !== 'production' && !direction) {
      throw new Error('Expected direction to be set');
    }

    var targetPos = getTargetPosition(direction, playerPos);

    if (!isPassable(level.getTile(targetPos))) {
      level.pulling = false;
      return false; // nothing to redraw
    }

    level.uiState.beforeMove();

    assign(level, {
      moving: true,
      targetPos,
    });

    if (pulling) {
      boxPulling.start(level);
    }
  }

  movePlayer(level, delta);

  return true; // redraw player
};
