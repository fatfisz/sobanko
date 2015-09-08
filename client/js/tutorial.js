/*
 * Sobanko
 * https://github.com/fatfisz/sobanko
 *
 * Copyright (c) 2015 FatFisz
 * Licensed under the MIT license.
 */

'use strict';

var { tiles } = require('./constants');
var controls = require('./controls');
var events = require('./events');
var gameLoop = require('./game_loop');
var storage = require('./storage');
var { $, root, toggleFocus, isPassable, getTargetPosition } = require('./utils');


var dialog = $('#tutorial-dialog')[0];
var caption = $('#tutorial-caption')[0];
var nextButton = $('#tutorial-next')[0];
var currentStep;

function isTouch() {
  return root.classList.contains('touch');
}

function checkSurroundings(level, predicate) {
  var { playerPos } = level;

  return predicate(level.getTile(getTargetPosition('up', playerPos))) ||
         predicate(level.getTile(getTargetPosition('down', playerPos))) ||
         predicate(level.getTile(getTargetPosition('left', playerPos))) ||
         predicate(level.getTile(getTargetPosition('right', playerPos)));
}

var steps = {
  start: {
    caption: `
      Welcome!<br>
      <br>
      The goal of Sobanko is to activate all of the boxes by dragging them to the activators.
    `,

    setup() {
      toggleFocus(['undo', 'restart', 'back']);
      nextButton.focus();
      events.on(nextButton, 'click', function handler() {
        events.off(nextButton, 'click', handler);
        nextStep(steps.move);
      });
    },
  },
  move: {
    get caption() {
      return `
        First, move next to a box using
        ${isTouch() ? 'the pad on the left' : 'arrow keys'}.
      `;
    },
    highlight: ['canvas', '#direction'],

    setup() {
      controls.setLock(false);
      nextButton.className = 'hidden';
    },

    afterMove(level) {
      if (checkSurroundings(level, (tile) => tiles[tile] === 'box')) {
        controls.setLock(true);
        nextStep(steps.drag, level);
      }
    },
  },
  drag: {
    get caption() {
      return `
        Now try dragging the box to an orange activator.<br>
        To do it, hold the ${isTouch() ? 'button on the right' : 'Shift key'} while moving.
      `;
    },
    highlight: ['#pulling'],

    setup(level) {
      controls.setLock(false);
      this.boxesLeft = level.boxesLeft;
    },

    afterMove(level) {
      var { boxesLeft } = level;

      if (this.boxesLeft !== boxesLeft) {
        controls.setLock(true);
        nextStep(steps.remember);
        return;
      }

      if (!checkSurroundings(level, isPassable)) {
        controls.setLock(true);
        nextStep(steps.stuck, level);
      }
    },
  },
  stuck: {
    caption: `
      It seems you got stuck!<br>
      <br>
      Restart and try again.
    `,

    setup(level) {
      nextButton.className = '';
      nextButton.textContent = 'Restart';
      nextButton.focus();

      events.on(nextButton, 'click', function handler() {
        events.off(nextButton, 'click', handler);
        nextButton.className = 'hidden';

        level.reset();
        storage.resetUndo();
        storage.saveState(level);

        gameLoop.scheduleRedraw();

        nextStep(steps.drag, level);
      });
    },
  },
  remember: {
    middle: true,
    get caption() {
      return `
        That's it! Now activate other boxes.<br>
        <br>
        Remember to use Undo and Restart buttons if you get stuck.<br>
        ${isTouch() ? '' : 'You can also use Ctrl + Z for undo too.<br>'}
        <br>
        If you win, you can play the same level again to try and finish in less moves than before.
      `;
    },
    dim: ['canvas', '#direction', '#pulling'],
    highlight: ['#undo', '#restart'],

    setup() {
      nextButton.className = '';
      nextButton.textContent = 'Finish tutorial';
      nextButton.focus();

      events.on(nextButton, 'click', function handler() {
        events.off(nextButton, 'click', handler);
        nextStep(steps.finish);
      });
    },
  },
  finish: {
    dim: ['#undo', '#restart'],

    setup() {
      toggleFocus(['undo', 'restart', 'back'], true);
      controls.setLock(false);
      storage.tutorialFinished();

      root.classList.remove('tutorial');
    },
  },
};

function nextStep(step, level) {
  dialog.classList.remove('visible');

  setTimeout(() => {
    currentStep = step;

    dialog.classList[step.middle ? 'add' : 'remove']('middle');

    if (step.caption) {
      caption.innerHTML = step.caption;
    }

    if (step.dim) {
      step.dim.forEach((selector) => {
        $(selector)[0].classList.remove('tutorial-highlight');
      });
    }

    if (step.highlight) {
      step.highlight.forEach((selector) => {
        $(selector)[0].classList.add('tutorial-highlight');
      });
    }

    if (step.setup) {
      step.setup(level);
    }

    dialog.classList.add('visible');
  }, 500);
}

module.exports = exports = {

  start(level) {
    controls.setLock(true);
    nextStep(steps.start, level);
  },

  afterMove(level) {
    if (currentStep.afterMove) {
      currentStep.afterMove(level);
    }
  },

};
