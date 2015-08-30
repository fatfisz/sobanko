'use strict';

var assign = require('object-assign');

var setupKeyboard = require('./keyboard');
var setupMouse = require('./mouse');


var blankState = {
  direction: null,
  pulling: false,
};

var controlsState = blankState;

function getStateCallback(callback) {
  return (_nextState) => {
    var nextState = assign({}, blankState, _nextState);

    if (controlsState.direction !== nextState.direction ||
        controlsState.pulling !== nextState.pulling) {
      controlsState = nextState;
      callback(controlsState);
    }
  };
}

module.exports = function setupControls(options) {
  var { isKeyboard, isMouse, callback } = options;
  var stateCallback = getStateCallback(callback);

  if (isKeyboard) {
    setupKeyboard(stateCallback);
  } else if (isMouse) {
    setupMouse(stateCallback);
  }
};
