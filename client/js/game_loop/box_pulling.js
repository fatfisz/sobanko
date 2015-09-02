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
    currentState.pulling = false;
    return;
  }

  data[boxY][boxX] = getTileBeforePulling(boxTile);

  if (tiles[boxTile] === 'boxInDestination') {
    level.boxesLeft += 1;
  }
}

function stop(level) {
  var { data, currentState, playerX, playerY } = level;
  var { direction } = currentState;
  var [boxX, boxY] = getBoxPosition(direction, playerX, playerY);
  var newBoxTile = getTileAfterPulling(data[boxY][boxX]);

  currentState.pulling = false;
  data[boxY][boxX] = newBoxTile;

  if (tiles[newBoxTile] === 'boxInDestination') {
    level.boxesLeft -= 1;
  }
}

module.exports = {
  start,
  stop,
};
