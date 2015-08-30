'use strict';

var keymirror = require('keymirror');


module.exports = {
  width: 20,
  height: 20,

  tileSize: 48,

  controls: keymirror({
    up: null,
    down: null,
    left: null,
    right: null,
    pulling: null,
  }),

  tiles: {
    1: 'wall',
    2: 'floor',
    3: 'box',
    4: 'destination',
    5: 'boxInDestination',
    6: 'player',
  },

  playerSpeed: 4,
};
