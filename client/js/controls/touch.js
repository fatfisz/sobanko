'use strict';

var events = require('../events');
var { $ } = require('../utils');


var gameContainer = $('#game-container')[0];
var centerOffset = 12 + 60; // padding + half size of the circle
var detectionBound = 400;

module.exports = function setup(state, callback, registerReset) {
  var directionElement = $('#direction')[0];
  var pullingElement = $('#pulling')[0];

  function handleTouchMove(event) {
    if (!event.changedTouches) {
      return;
    }

    var { clientX, clientY } = event.changedTouches[0];

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
      handleTouchMove(event);
    })
    .on(directionElement, 'touchend', () => {
      directionElement.classList.remove('active');
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
      $('html')[0].classList.add('touch');

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
