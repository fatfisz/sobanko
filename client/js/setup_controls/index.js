'use strict';

var assign = require('object-assign');

var setupKeyboard = require('./keyboard');
var setupTouch = require('./touch');


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

module.exports = function setupControls(callback) {
  var stateCallback = getStateCallback(callback);

  setupKeyboard(stateCallback);
  setupTouch(stateCallback);
};
