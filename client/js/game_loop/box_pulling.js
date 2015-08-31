'use strict';

var { tiles } = require('../constants');
var {
  isBoxTile,
  getBoxPosition,
  getTileBeforePulling,
  getTileAfterPulling,
} = require('../utils');


function start(level) {
  var { data, currentState, playerX, playerY } = level;
  var { direction } = currentState;
  var [boxX, boxY] = getBoxPosition(direction, playerX, playerY);
  var boxTile = data[boxY][boxX];

  if (!isBoxTile(boxTile)) {
    return;
  }

  data[boxY][boxX] = getTileBeforePulling(boxTile);
  level.setPulledBoxState({
    direction,
    type: boxTile,
  });
}

function stop(level) {
  var { data, uiState, pulledBoxState, playerX, playerY } = level;
  var { direction, type } = pulledBoxState;
  var [boxX, boxY] = getBoxPosition(direction, playerX, playerY);
  var newBoxTile = getTileAfterPulling(data[boxY][boxX]);

  data[boxY][boxX] = newBoxTile;
  level.clearPulledBoxState();

  if (newBoxTile === type) {
    return;
  }

  level.boxesLeft += (tiles[newBoxTile] === 'box' ? 1 : -1);
}

module.exports = {
  start,
  stop,
};
