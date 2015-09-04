'use strict';

var assign = require('object-assign');

var setupKeyboard = require('./keyboard');
var setupTouch = require('./touch');


var blankState = {
  direction: null,
  pulling: false,
  special: null,
};

var state = blankState;

function getStateCallback(callback) {
  return (_nextState) => {
    var nextState = assign({}, blankState, _nextState);

    if (state.direction !== nextState.direction ||
        state.pulling !== nextState.pulling ||
        state.special !== nextState.special) {
      state = nextState;
      callback(state);
    }
  };
}

function registerReset(resetCallback) {
  window.addEventListener('blur', resetCallback);
  document.addEventListener('visibilitychange', resetCallback);
}

module.exports = {

  get state() {
    return state;
  },

  setup(callback) {
    var stateCallback = getStateCallback(callback);

    setupKeyboard(stateCallback, registerReset);
    setupTouch(stateCallback, registerReset);
  },

};
