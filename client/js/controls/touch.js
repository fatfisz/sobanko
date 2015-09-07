'use strict';

var events = require('../events');
var { $, root } = require('../utils');


var gameContainer = $('#game-container')[0];
var centerOffset = 12 + 60; // padding + half size of the circle
var detectionBound = 300;

module.exports = function setup(state, callback, registerReset) {
  var directionElement = $('#direction')[0];
  var pullingElement = $('#pulling')[0];
  var directionTouchIdentifier = null;

  function handleTouchMove(event) {
    if (!event.changedTouches) {
      return;
    }

    var clientX;
    var clientY;
    var found = false;

    [].forEach.call(event.changedTouches, (touch) => {
      if (touch.identifier === directionTouchIdentifier) {
        ({ clientX, clientY } = touch);
        found = true;
      }
    });

    if (!found) {
      return;
    }

    var x = clientX - centerOffset;
    var y = clientY - gameContainer.clientHeight + centerOffset;
    var direction = null;

    if (x * x + y * y > detectionBound) {
      if (x + y > 0) {
        if (x - y > 0) {
          direction = 'right';
        } else {
          direction = 'down';
        }
      } else if (x - y > 0) {
        direction = 'up';
      } else {
        direction = 'left';
      }
    }

    if (state.direction !== direction) {
      state.direction = direction;
      callback();
    }
  }

  events
    .on(directionElement, 'touchstart', (event) => {
      directionElement.classList.add('active');
      directionTouchIdentifier = event.changedTouches[0].identifier;
      handleTouchMove(event);
    })
    .on(directionElement, 'touchend', () => {
      directionElement.classList.remove('active');
      directionTouchIdentifier = null;
      state.direction = null;
      callback();
    })
    .on(directionElement, 'touchmove', handleTouchMove)
    .on(pullingElement, 'touchstart', () => {
      pullingElement.classList.add('active');
      state.pulling = true;
      callback();
    })
    .on(pullingElement, 'touchend', () => {
      pullingElement.classList.remove('active');
      state.pulling = false;
      callback();
    })
    .on(document, 'touchstart', function enableTouch() {
      root.classList.add('touch');

      events.off(document, 'touchstart', enableTouch);
    })
    .on(document, 'contextmenu', (event) => {
      event.preventDefault();
    });

  registerReset(() => {
    [].forEach.call($('#mobile-controls .active'), (element) => {
      element.classList.remove('active');
    });
  });
};
