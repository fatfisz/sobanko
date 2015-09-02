'use strict';

var { tiles } = require('./constants');


var $ = document.querySelectorAll.bind(document);

module.exports = exports = {

  $,
  context: $('canvas')[0].getContext('2d'),

  getTileFromName(name) {
    for (var key in tiles) {
      if (tiles[key] === name) {
        return +key;
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      throw new Error(`Unknown tile name ${name}`);
    }
  },

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
      return exports.getTileFromName('floor');
    }

    if (name === 'boxInDestination') {
      return exports.getTileFromName('destination');
    }

    if (process.env.NODE_ENV !== 'production') {
      throw new Error('Unexpected tile');
    }
  },

  getTileAfterPulling(tile) {
    var name = tiles[tile];

    if (name === 'floor') {
      return exports.getTileFromName('box');
    }

    if (name === 'destination') {
      return exports.getTileFromName('boxInDestination');
    }

    if (process.env.NODE_ENV !== 'production') {
      throw new Error('Unexpected tile');
    }
  },

};
