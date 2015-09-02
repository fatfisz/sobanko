'use strict';

var {
  isBoxTile,
  getBoxPosition,
  getTileBeforePulling,
  getTileAfterPulling,
} = require('../utils');


module.exports = {

  start(level) {
    var { data, direction, playerX, playerY } = level;
    var [boxX, boxY] = getBoxPosition(direction, playerX, playerY);
    var boxTile = data[boxY][boxX];

    if (!isBoxTile(boxTile)) {
      level.pulling = false;
      return;
    }

    level.prevBoxType = boxTile;
    data[boxY][boxX] = getTileBeforePulling(boxTile);
  },

  stop(level) {
    var { data, direction, playerX, playerY } = level;
    var [boxX, boxY] = getBoxPosition(direction, playerX, playerY);

    level.pulling = false;
    data[boxY][boxX] = getTileAfterPulling(data[boxY][boxX]);
  },

};
