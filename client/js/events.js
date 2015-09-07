/*
 * Sobanko
 * https://github.com/fatfisz/sobanko
 *
 * Copyright (c) 2015 FatFisz
 * Licensed under the MIT license.
 */

'use strict';

var events = {};

function getEventHandler(eventName) {
  return (event) => {
    var { target } = event;

    if (eventName === 'click' && event.button !== 0) {
      // FF fires `click` also for right-clicks
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
