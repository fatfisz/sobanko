'use strict';

var keys = {
  16: 'pulling',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
};

var order = [];

module.exports = function setup(callback, controlsState) {

  window.onkeydown = (event) => {
    var which = keys[event.which];

    if (!which) {
      return;
    }

    if (which === 'pulling') {
      if (!controlsState.pulling) {
        controlsState.pulling = true;
        callback();
      }
      return;
    }

    if (order.indexOf(which) !== -1) {
      return;
    }

    if (order.push(which) === 1) {
      controlsState.direction = which;
      callback();
    }
  };

  window.onkeyup = (event) => {
    var which = keys[event.which];

    if (!which) {
      return;
    }

    if (which === 'pulling') {
      if (controlsState.pulling) {
        controlsState.pulling = false;
        callback();
      }
      return;
    }

    var whichOrder = order.indexOf(which);

    if (whichOrder === -1) {
      return;
    }

    order.splice(whichOrder, 1);

    if (whichOrder === 0) {
      controlsState.direction = order[0] || null;
      callback();
    }
  };

};
