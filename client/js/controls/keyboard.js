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
  var ctrlActive = pressedKeys.indexOf(ctrlKey) !== -1;
  var lastKey = pressedKeys[length - 1];
  var result = {
    pulling: shiftIndex !== -1,
  };
  var shiftIsLast = shiftIndex === length - 1;

  if (shiftIsLast) {
    lastKey = pressedKeys[length - 2] || null;
  }

  var direction = directionKeys[lastKey] || null;
  var special = specialKeys[lastKey] || null;

  if (direction || shiftIsLast || doNotCheckSpecial) {
    result.direction = direction;
  } else if (special && ctrlActive) {
    result.special = special;
  }

  return result;
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
