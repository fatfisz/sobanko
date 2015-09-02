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
  level.pulledBoxDirection = direction;

  if (tiles[boxTile] === 'boxInDestination') {
    level.boxesLeft += 1;
  }

}

function stop(level) {
  var { data, pulledBoxDirection, playerX, playerY } = level;
  var [boxX, boxY] = getBoxPosition(pulledBoxDirection, playerX, playerY);
  var newBoxTile = getTileAfterPulling(data[boxY][boxX]);

  data[boxY][boxX] = newBoxTile;
  level.pulledBoxDirection = null;

  if (tiles[newBoxTile] === 'boxInDestination') {
    level.boxesLeft -= 1;
  }
}

module.exports = {
  start,
  stop,
};
