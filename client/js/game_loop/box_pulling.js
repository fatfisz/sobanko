'use strict';

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
    currentState.pulling = false;
    return;
  }

  level.prevBoxType = boxTile;
  data[boxY][boxX] = getTileBeforePulling(boxTile);
}

function stop(level) {
  var { data, currentState, playerX, playerY } = level;
  var { direction } = currentState;
  var [boxX, boxY] = getBoxPosition(direction, playerX, playerY);

  currentState.pulling = false;
  data[boxY][boxX] = getTileAfterPulling(data[boxY][boxX]);
}

module.exports = {
  start,
  stop,
};
