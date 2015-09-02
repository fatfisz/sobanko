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

function movePlayer(level, delta) {
  var { uiState, direction, pulling } = level;
  var axis = directionToAxis[direction];
  var directionMod = directionToDirectionMod[direction];
  var playerProp = `player${axis}`;
  var targetProp = `target${axis}`;
  var mod = delta * playerSpeed;

  level[playerProp] += mod * directionMod;

  // Did we move past the target?
  if (directionMod * (level[playerProp] - level[targetProp]) > 0) {
    level[playerProp] = level[targetProp];
    level.moving = false;

    if (pulling) {
      boxPulling.stop(level);
    }

    uiState.afterMove();
  }
}

module.exports = function movePlayerAndBox(level, delta) {
  var {
    data,
    moving,
    playerX,
    playerY,
  } = level;

  if (!moving) {
    var { direction, pulling } = controls.state;

    assign(level, {
      direction,
      pulling,
    });

    if (process.env.NODE_ENV !== 'production' && !direction) {
      throw new Error('Expected direction to be set');
    }

    var [targetX, targetY] = getTargetPosition(direction, playerX, playerY);

    if (!isPassable(data[targetY][targetX])) {
      level.pulling = false;
      return false; // nothing to redraw
    }

    level.uiState.beforeMove();

    assign(level, {
      moving: true,
      targetX,
      targetY,
    });

    if (pulling) {
      boxPulling.start(level);
    }
  }

  movePlayer(level, delta);

  return true; // redraw player
};
