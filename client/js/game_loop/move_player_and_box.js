'use strict';

var assign = require('object-assign');

var { playerSpeed } = require('../constants');
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

function endMove(level) {
  level.clearCurrentState();

  if (level.pulledBoxState.direction) {
    boxPulling.stop(level);
  }

  level.uiState.moveFinished();
}

function movePlayer(level, direction, delta) {
  var axis = directionToAxis[direction];
  var directionMod = directionToDirectionMod[direction];
  var playerProp = `player${axis}`;
  var targetProp = `target${axis}`;
  var mod = delta / 1000 * playerSpeed;

  level[playerProp] += mod * directionMod;
  level.playerMoved = true;

  if (directionMod * (level[playerProp] - level[targetProp]) > 0) {
    // Did we move past the target?
    level[playerProp] = level[targetProp];
    endMove(level);
  }
}

module.exports = function movePlayerAndBox(level, delta) {
  var { data, currentState, controlsState, playerX, playerY } = level;
  var { direction } = currentState;

  if (!direction) {
    // Controls state must have a direction set
    var [targetX, targetY] = getTargetPosition(controlsState.direction, playerX, playerY);

    if (!isPassable(data[targetY][targetX])) {
      // Player can't pass
      return;
    }

    level.setCurrentState(controlsState);
    currentState = level.currentState;
    assign(level, { targetX, targetY });
    ({ direction } = currentState);

    if (currentState.pulling) {
      boxPulling.start(level);
    }
  }

  movePlayer(level, direction, delta);
};
