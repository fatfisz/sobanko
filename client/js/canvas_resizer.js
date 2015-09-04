'use strict';

var assign = require('object-assign');


module.exports = function canvasResizer(canvas) {
  var container = canvas.parentElement;

  return () => {
    var { clientWidth, clientHeight } = container;
    var minSize = Math.min(clientWidth, clientHeight) + 'px';

    assign(canvas.style, {
      width: minSize,
      height: minSize,
    });
  };
};
