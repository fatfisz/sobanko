'use strict';

var { tiles } = require('./constants');


var $ = document.querySelectorAll.bind(document);

module.exports = exports = {

  $,
  context: $('canvas')[0].getContext('2d'),

  isPassable(tile) {
    var name = tiles[tile];

    return name === 'floor' || name === 'destination';
  },

  isBoxTile(tile) {
    var name = tiles[tile];

    return name === 'box' || name === 'boxInDestination';
  },

  isWallOrEmptyTile(tile) {
    var name = tiles[tile];

    return !name || name === 'wall';
  },

  getTargetPosition(direction, playerX, playerY) {
    switch (direction) {
      case 'up':
        return [playerX, playerY - 1];
      case 'down':
        return [playerX, playerY + 1];
      case 'left':
        return [playerX - 1, playerY];
      case 'right':
        return [playerX + 1, playerY];
    }

    if (process.env.NODE_ENV !== 'production') {
      throw new Error('Invalid direction specified');
    }
  },

  getBoxPosition(direction, playerX, playerY) {
    switch (direction) {
      case 'up':
        return [playerX, playerY + 1];
      case 'down':
        return [playerX, playerY - 1];
      case 'left':
        return [playerX + 1, playerY];
      case 'right':
        return [playerX - 1, playerY];
    }

    if (process.env.NODE_ENV !== 'production') {
      throw new Error('Invalid direction specified');
    }
  },

  getTileBeforePulling(tile) {
    var name = tiles[tile];

    if (name === 'box') {
      return tiles.floor;
    }

    if (name === 'boxInDestination') {
      return tiles.destination;
    }

    if (process.env.NODE_ENV !== 'production') {
      throw new Error('Unexpected tile');
    }
  },

  getTileAfterPulling(tile) {
    var name = tiles[tile];

    if (name === 'floor') {
      return tiles.box;
    }

    if (name === 'destination') {
      return tiles.boxInDestination;
    }

    if (process.env.NODE_ENV !== 'production') {
      throw new Error('Unexpected tile');
    }
  },

};
