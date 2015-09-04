'use strict';

var events = require('../events');
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

function setupHandlers(activate, deactivate, id) {
  var element = $(`#${id}`)[0];

  events
    .on(element, 'touchstart', activate)
    .on(element, 'mousedown', activate)
    .on(element, 'touchend', deactivate)
    .on(element, 'mouseup', deactivate);
}

module.exports = function setup(callback, registerReset) {
  ['up', 'down', 'left', 'right'].forEach(
    setupHandlers.bind(
      null,
      (event) => {
        var element = event.target;

        element.className = 'active';

        if (pressedButtons.indexOf(element.id) === -1) {
          pressedButtons.push(element.id);
        }
        callback(getState());
      },
      (event) => {
        var element = event.target;

        element.className = '';

        var pos = pressedButtons.indexOf(element.id);

        if (pos !== -1) {
          pressedButtons.splice(pos, 1);
        }
        callback(getState());
      }
    )
  );

  setupHandlers(
    (event) => {
      var element = event.target;

      element.className = 'active';

      pulling = true;
      callback(getState());
    },
    (event) => {
      var element = event.target;

      element.className = '';

      pulling = false;
      callback(getState());
    },
    'pulling'
  );

  events.on(document, 'touchstart', function enableTouch() {
    $('html')[0].className = 'touch';

    events.off(document, 'touchstart', enableTouch);
  });

  registerReset(() => {
    pulling = false;
    pressedButtons.length = 0;

    [].forEach.call($('#mobile-controls .active'), (element) => {
      element.className = '';
    });

    callback(null);
  });
};
