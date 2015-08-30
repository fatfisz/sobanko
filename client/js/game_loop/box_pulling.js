'use strict';

var assign = require('object-assign');

var { tiles } = require('../constants');
var {
  isBoxTile,
  getBoxPosition,
  getTileBeforePulling,
  getTileAfterPulling,
} = require('../utils');


function start(level) {
  var { data, currentState, pulledBox, playerX, playerY } = level;
  var { direction } = currentState;
  var [boxX, boxY] = getBoxPosition(direction, playerX, playerY);
  var boxTile = data[boxY][boxX];

  if (!isBoxTile(boxTile)) {
    return;
  }

  data[boxY][boxX] = getTileBeforePulling(boxTile);
  assign(pulledBox, {
    direction,
    type: boxTile,
  });
}

function stop(level) {
  var { data, uiState, pulledBox, playerX, playerY } = level;
  var [boxX, boxY] = getBoxPosition(pulledBox.direction, playerX, playerY);
  var newBoxTile = getTileAfterPulling(data[boxY][boxX]);

  data[boxY][boxX] = newBoxTile;
  pulledBox.direction = null;

  if (newBoxTile === pulledBox.type) {
    return;
  }

  level.boxesLeft += (tiles[newBoxTile] === 'box' ? 1 : -1);
  uiState.boxesLeftChanged(level.boxesLeft);
}

module.exports = {
  start,
  stop,
};
