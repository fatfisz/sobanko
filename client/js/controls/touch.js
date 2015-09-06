'use strict';

var events = require('../events');
var { $ } = require('../utils');


var gameContainer = $('#game-container')[0];
var centerOffset = 12 + 60; // padding + half size of the circle
var detectionBound = 400;

var direction = null;
var detectingDirection = false;
var pulling = false;

var centerOffset = 12 + 50; // padding + half size of the circle

function getState() {
  return {
    direction: detectingDirection ? direction : null,
    pulling,
  };
}

module.exports = function setup(callback, registerReset) {
  var directionElement = $('#direction')[0];
  var pullingElement = $('#pulling')[0];

  function handleTouchMove(event) {
    if (!event.changedTouches) {
      return;
    }

    var { clientX, clientY } = event.changedTouches[0];

    var x = clientX - centerOffset;
    var y = clientY - gameContainer.clientHeight + centerOffset;
    direction = null;

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

    callback(getState());
  }

  events
    .on(directionElement, 'touchstart', (event) => {
      directionElement.className = 'active';
      detectingDirection = true;
      handleTouchMove(event);
      callback(getState());
    })
    .on(directionElement, 'touchend', () => {
      directionElement.className = '';
      detectingDirection = false;
      callback(getState());
    })
    .on(directionElement, 'touchmove', handleTouchMove)
    .on(pullingElement, 'touchstart', () => {
      pullingElement.className = 'active';
      pulling = true;
      callback(getState());
    })
    .on(pullingElement, 'touchend', () => {
      pullingElement.className = '';
      pulling = false;
      callback(getState());
    })
    .on(document, 'touchstart', function enableTouch() {
      $('html')[0].className = 'touch';

      events.off(document, 'touchstart', enableTouch);
    })
    .on(document, 'contextmenu', (event) => {
      event.preventDefault();
    });

  registerReset(() => {
    direction = null;
    detectingDirection = false;
    pulling = false;

    [].forEach.call($('#mobile-controls .active'), (element) => {
      element.className = '';
    });

    callback(null);
  });
};
