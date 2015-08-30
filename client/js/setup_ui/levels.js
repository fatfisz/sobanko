'use strict';

var levels = require('../levels');
var state = require('../state');
var { $ } = require('../utils');


var levelsContainer = $('#levels')[0];
var levelsFragment = document.createDocumentFragment();
var levelBox;

function getClickHandler(i) {
  return () => {
    if (state.playing) {
      // Don't do anything when the game has already started
      return;
    }

    state.startLevel(i);
  };
}

for (var i = 0, ii = levels.length; i < ii; i += 1) {
  levelBox = document.createElement('div');
  levelBox.classList.add('level');
  levelBox.onclick = getClickHandler(i);
  levelBox.textContent = i + 1;
  levelsFragment.appendChild(levelBox);
}

levelsContainer.appendChild(levelsFragment);
