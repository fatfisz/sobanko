'use strict';

var setupKeyboard = require('./keyboard');
var setupMouse = require('./mouse');


var controlsState = {
  direction: null,
  pulling: false,
};

module.exports = function setupControls(options) {
  var { isKeyboard, isMouse, callback } = options;
  var stateCallback = () => callback(controlsState);

  if (isKeyboard) {
    setupKeyboard(stateCallback, controlsState);
  } else if (isMouse) {
    setupMouse(stateCallback, controlsState);
  }
};
