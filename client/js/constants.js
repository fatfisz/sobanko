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
    wall: 1,

    2: 'floor',
    floor: 2,

    3: 'box',
    box: 3,

    4: 'destination',
    destination: 4,

    5: 'boxInDestination',
    boxInDestination: 5,

    6: 'player',
    player: 6,
  },

  playerSpeed: 4e-3,
};
