'use strict';

var assign = require('object-assign');

var { width, height, tileSize } = require('./constants');
var { canvas } = require('./utils').context;


var container = canvas.parentElement;
var aspectRatio = width / height;

module.exports = function resizeCanvas() {
  var { clientWidth, clientHeight } = container;

  clientWidth = Math.min(clientWidth, width * tileSize);
  clientHeight = Math.min(clientHeight, height * tileSize);

  assign(canvas.style, {
    width: Math.min(clientWidth, clientHeight * aspectRatio) + 'px',
    height: Math.min(clientWidth / aspectRatio, clientHeight) + 'px',
  });
};
