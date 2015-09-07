'use strict';

/* This code exists only because Chrome would behave in a very strange way when
 * dubugging through "Inspect device". It seems that adding event listeners
 * only on document and window solved the problem.
 */

var events = {};

function getEventHandler(eventName) {
  return (event) => {
    var { target } = event;

    if (eventName === 'click' && event.button !== 0) {
      event.preventDefault();
      return;
    }

    function fireHandlerIfMatches([_element, handler]) {
      if (_element === target) {
        handler.call(target, event);
      }
    }

    while (target) {
      events[eventName].forEach(fireHandlerIfMatches);
      target = target.parentNode;
    }
  };
}

module.exports = exports = {

  on(element, eventName, handler) {
    if (!events[eventName]) {
      events[eventName] = [];
      document.addEventListener(eventName, getEventHandler(eventName));
    }

    events[eventName].push([element, handler]);

    return exports;
  },

  off(element, eventName, handler) {
    events[eventName] = events[eventName].filter((item) => {
      var [_element, _handler] = item;

      return _element !== element || _handler !== handler;
    });

    return exports;
  },

};
