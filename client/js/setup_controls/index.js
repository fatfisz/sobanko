'use strict';

var assign = require('object-assign');

var setupKeyboard = require('./keyboard');
var setupMouse = require('./mouse');


var blankState = {
  direction: null,
  pulling: false,
  special: null,
};

var controlsState = blankState;

function getStateCallback(callback) {
  return (_nextState) => {
    var nextState = assign({}, blankState, _nextState);

    if (controlsState.direction !== nextState.direction ||
        controlsState.pulling !== nextState.pulling ||
        controlsState.special !== nextState.special) {
      controlsState = nextState;
      callback(controlsState);
    }
  };
}

module.exports = function setupControls(type, callback) {
  var stateCallback = getStateCallback(callback);

  if (type === 'keyboard') {
    setupKeyboard(stateCallback);
  } else if (type === 'mouse') {
    setupMouse(stateCallback);
  }
};
