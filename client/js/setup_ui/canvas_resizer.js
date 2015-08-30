'use strict';

var assign = require('object-assign');

var { width, height } = require('../constants');


var aspectRatio = width / height;

module.exports = function canvasResizer(canvas) {
  var container = canvas.parentElement;

  return () => {
    var { clientWidth, clientHeight } = container;

    assign(canvas.style, {
      width: Math.min(clientWidth, aspectRatio * clientHeight) + 'px',
      height: Math.min(clientWidth / aspectRatio, clientHeight) + 'px',
    });
  };
};
