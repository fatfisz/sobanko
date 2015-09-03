'use strict';

var {
  isBoxTile,
  opposite,
  getBoxPosition,
  getTileBeforePulling,
  getTileAfterPulling,
} = require('../utils');


module.exports = {

  start(level) {
    var { direction, playerPos } = level;
    var boxPos = getBoxPosition(direction, playerPos);
    var boxTile = level.getTile(boxPos);

    if (!isBoxTile(boxTile)) {
      level.pulling = false;
      return;
    }

    level.prevBoxType = boxTile;
    level.setTile(boxPos, getTileBeforePulling(boxTile));
  },

  stop(level) {
    var { direction, playerPos } = level;
    var boxPos = getBoxPosition(direction, playerPos);
    var boxTile = level.getTile(boxPos);

    level.direction = opposite[direction];
    level.pulling = false;
    level.setTile(boxPos, getTileAfterPulling(boxTile));
  },

};
