'use strict';

var { context } = require('../../utils');
var drawBoxHelper = require('./common_helpers/box');
var drawFloor = require('./floor');
var tilePredraw = require('./tile_predraw');


var box = tilePredraw(drawBoxHelper.bind(null, '#ccd7ea'));

module.exports = function drawBox(drawX, drawY, data, x, y) {
  if (Array.isArray(data)) {
    drawFloor(drawX, drawY, data, x, y);
  }

  context.drawImage(box, drawX, drawY);
};
