/*
 * Sobanko
 * https://github.com/fatfisz/sobanko
 *
 * Copyright (c) 2015 FatFisz
 * Licensed under the MIT license.
 */

'use strict';

var setupKeyboard = require('./keyboard');
var setupTouch = require('./touch');


var state = {
  direction: null,
  pulling: false,
  special: null,
};
var locked = false;
var callback;

function registerReset(resetCallback) {
  window.addEventListener('blur', resetCallback);
  document.addEventListener('visibilitychange', resetCallback);
}

function resetState() {
  state.direction = null;
  state.pulling = false;
  state.special = null;
  callback();
}

function guardedCallback() {
  if (locked) {
    resetState();
    return;
  }

  callback();
}

module.exports = {

  get state() {
    return state;
  },

  setup(_callback) {
    callback = _callback;

    setupKeyboard(state, guardedCallback, registerReset);
    setupTouch(state, guardedCallback, registerReset);
    registerReset(resetState);
  },

  setLock(lock) {
    locked = lock;
    resetState();
  },

};
