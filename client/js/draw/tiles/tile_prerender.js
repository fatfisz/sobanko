'use strict';

var { tileSize } = require('../../constants');


var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');

canvas.width = tileSize;
canvas.height = tileSize;

module.exports = function tilePrerender(draw) {
  var image = new Image();

  context.clearRect(0, 0, tileSize, tileSize);
  draw(context);

  image.src = canvas.toDataURL();
  return image;
};
