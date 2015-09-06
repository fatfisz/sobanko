'use strict';

var setupKeyboard = require('./keyboard');
var setupTouch = require('./touch');


var state = {
  direction: null,
  pulling: false,
  special: null,
};

function registerReset(resetCallback) {
  window.addEventListener('blur', resetCallback);
  document.addEventListener('visibilitychange', resetCallback);
}

function resetState(callback) {
  state.direction = null;
  state.pulling = false;
  state.special = null;
  callback();
}

module.exports = {

  get state() {
    return state;
  },

  setup(callback) {
    setupKeyboard(state, callback, registerReset);
    setupTouch(state, callback, registerReset);
    registerReset(resetState.bind(null, callback));
  },

};
