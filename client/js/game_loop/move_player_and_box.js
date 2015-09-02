'use strict';

var assign = require('object-assign');

var { playerSpeed } = require('../constants');
var controls = require('../controls');
var { isPassable, getTargetPosition } = require('../utils');
var boxPulling = require('./box_pulling');


var directionToAxis = {
  up: 'Y',
  down: 'Y',
  left: 'X',
  right: 'X',
};

var directionToDirectionMod = {
  up: -1,
  down: 1,
  left: -1,
  right: 1,
};

function movePlayer(level, direction, delta) {
  var axis = directionToAxis[direction];
  var directionMod = directionToDirectionMod[direction];
  var playerProp = `player${axis}`;
  var targetProp = `target${axis}`;
  var mod = delta * playerSpeed;

  level[playerProp] += mod * directionMod;

  // Did we move past the target?
  if (directionMod * (level[playerProp] - level[targetProp]) > 0) {
    level[playerProp] = level[targetProp];
    level.playerMoving = false;

    if (level.currentState.pulling) {
      boxPulling.stop(level);
    }

    level.uiState.afterMove();
  }
}

module.exports = function movePlayerAndBox(level, delta) {
  var {
    data,
    currentState,
    playerMoving,
    playerX,
    playerY,
  } = level;

  if (!playerMoving) {
    var { direction, pulling } = controls.state;

    assign(currentState, {
      direction,
      pulling,
    });

    if (process.env.NODE_ENV !== 'production' && !direction) {
      throw new Error('Expected direction to be set');
    }

    var [targetX, targetY] = getTargetPosition(direction, playerX, playerY);

    if (!isPassable(data[targetY][targetX])) {
      currentState.pulling = false;
      return false; // nothing to redraw
    }

    level.uiState.beforeMove();

    assign(level, {
      playerMoving: true,
      targetX,
      targetY,
    });

    if (pulling) {
      boxPulling.start(level);
    }
  }

  movePlayer(level, currentState.direction, delta);

  return true; // redraw player
};
