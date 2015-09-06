'use strict';

var shiftKey = 16;
var ctrlKey = 17;

var directionKeys = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
};

var specialKeys = {
  90: 'undo',
};

module.exports = function setup(state, callback, registerReset) {
  var pressedKeys = [];

  function keysChanged(doNotCheckSpecial) {
    var length = pressedKeys.length;

    if (length === 0) {
      if (state.direction || state.pulling || state.special) {
        state.direction = null;
        state.pulling = false;
        state.special = null;
        callback();
      }

      return;
    }

    var changed = false;
    var shiftIndex = pressedKeys.indexOf(shiftKey);
    var ctrlActive = pressedKeys.indexOf(ctrlKey) !== -1;
    var lastKey = pressedKeys[length - 1];
    var pulling = shiftIndex !== -1;
    var shiftIsLast = shiftIndex === length - 1;

    if (shiftIsLast) {
      lastKey = pressedKeys[length - 2] || null;
    }

    var direction = directionKeys[lastKey] || null;
    var special = specialKeys[lastKey] || null;

    if (direction || shiftIsLast || doNotCheckSpecial) {
      if (state.direction !== direction || state.special) {
        changed = true;
        state.direction = direction;
        state.special = null;
      }
    } else if (special && ctrlActive) {
      if (state.special !== special || state.direction) {
        changed = true;
        state.direction = null;
        state.special = special;
      }
    }

    if (state.pulling !== pulling) {
      changed = true;
      state.pulling = pulling;
    }

    if (changed) {
      callback();
    }
  }

  window.onkeydown = ({ which }) => {
    if (pressedKeys.indexOf(which) === -1) {
      pressedKeys.push(which);
    }
    keysChanged();
  };

  window.onkeyup = ({ which }) => {
    var pos = pressedKeys.indexOf(which);

    if (pos !== -1) {
      pressedKeys.splice(pos, 1);
    }
    keysChanged(true);
  };

  registerReset(() => {
    pressedKeys.length = 0;
    callback(null);
  });
};
