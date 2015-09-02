'use strict';

var { context } = require('../../utils');
var drawBoxHelper = require('./box_helper');
var drawFloor = require('./floor');
var tilePredraw = require('./tile_predraw');


var boxInDestination = tilePredraw(drawBoxHelper.bind(null, '#9be581'));

module.exports = function drawBoxInDestination(drawX, drawY, data, x, y) {
  if (Array.isArray(data)) {
    drawFloor(drawX, drawY, data, x, y);
  }

  context.drawImage(boxInDestination, drawX, drawY);
};
