'use strict';

var { $ } = require('../utils');


var pulling = false;
var pressedButtons = [];

function getState() {
  var result = {
    pulling,
  };
  var length = pressedButtons.length;

  if (length !== 0) {
    result.direction = pressedButtons[length - 1];
  }

  return result;
}

function setupDirectionHandlers(callback, id) {
  var element = $('#' + id)[0];

  element.ontouchstart = () => {
    if (pressedButtons.indexOf(id) === -1) {
      pressedButtons.push(id);
    }
    callback(getState());
  };

  element.ontouchend = () => {
    var pos = pressedButtons.indexOf(id);

    if (pos !== -1) {
      pressedButtons.splice(pos, 1);
    }
    callback(getState());
  };
}

function setupPullingHandlers(callback) {
  var element = $('#pulling')[0];

  element.ontouchstart = () => {
    pulling = true;
    callback(getState());
  };

  element.ontouchend = () => {
    pulling = false;
    callback(getState());
  };
}

module.exports = function setup(callback) {
  ['up', 'down', 'left', 'right'].forEach(
    setupDirectionHandlers.bind(null, callback)
  );
  setupPullingHandlers(callback);
};
