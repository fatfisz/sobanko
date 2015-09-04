'use strict';

var assign = require('object-assign');

var { canvas } = require('./utils').context;


var container = canvas.parentElement;

module.exports = function resizeCanvas() {
  var { clientWidth, clientHeight } = container;
  var minSize = Math.min(clientWidth, clientHeight) + 'px';

  assign(canvas.style, {
    width: minSize,
    height: minSize,
  });
};
