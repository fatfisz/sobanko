'use strict';

var shiftKey = 16;

var directionKeys = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
};

var pressedKeys = [];

function getState() {
  var length = pressedKeys.length;

  if (length === 0) {
    return null;
  }

  var shiftIndex = pressedKeys.indexOf(shiftKey);
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
    callback(getState());
  };

};
