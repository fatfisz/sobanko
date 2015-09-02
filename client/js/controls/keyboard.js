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

var pressedKeys = [];

function getState(doNotCheckSpecial) {
  var length = pressedKeys.length;

  if (length === 0) {
    return null;
  }

  var shiftIndex = pressedKeys.indexOf(shiftKey);
  var ctrlIndex = pressedKeys.indexOf(ctrlKey);
  var lastKey = pressedKeys[length - 1];

  if (shiftIndex === length - 1) {
    lastKey = length === 1 ? null : pressedKeys[length - 2];
  }

  if (directionKeys[lastKey]) {
    return {
      direction: directionKeys[lastKey],
      pulling: shiftIndex !== -1,
    };
  }

  if (shiftIndex === length - 1) {
    // Shift is the last key, but the last but one is not a direction key
    return null;
  }

  if (doNotCheckSpecial) {
    // Don't fire special keys on keyup
    return null;
  }

  if (specialKeys[lastKey] && ctrlIndex !== -1) {
    return {
      special: specialKeys[lastKey],
    };
  }

  return null;
}

module.exports = function setup(callback) {

  window.onkeydown = ({ which }) => {
    if (pressedKeys.indexOf(which) === -1) {
      pressedKeys.push(which);
    }
    callback(getState());
  };

  window.onkeyup = ({ which }) => {
    var pos = pressedKeys.indexOf(which);

    if (pos !== -1) {
      pressedKeys.splice(pos, 1);
    }
    callback(getState(true));
  };

};
