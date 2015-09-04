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
    element.className = 'active';

    if (pressedButtons.indexOf(id) === -1) {
      pressedButtons.push(id);
    }
    callback(getState());
  };

  element.ontouchend = () => {
    element.className = '';

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
    element.className = 'active';

    pulling = true;
    callback(getState());
  };

  element.ontouchend = () => {
    element.className = '';

    pulling = false;
    callback(getState());
  };
}

module.exports = function setup(callback, registerReset) {
  ['up', 'down', 'left', 'right'].forEach(
    setupDirectionHandlers.bind(null, callback)
  );
  setupPullingHandlers(callback);

  registerReset(() => {
    pulling = false;
    pressedButtons.length = 0;

    [].forEach.call($('#mobile-controls .active'), (element) => {
      element.className = '';
    });

    callback(null);
  });
};
