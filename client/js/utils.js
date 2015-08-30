'use strict';

var { tiles } = require('./constants');


var utils = {

  $: document.querySelectorAll.bind(document),

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
      return utils.getTileFromName('floor');
    }

    if (name === 'boxInDestination') {
      return utils.getTileFromName('destination');
    }

    if (process.env.NODE_ENV !== 'production') {
      throw new Error('Unexpected tile');
    }
  },

  getTileAfterPulling(tile) {
    var name = tiles[tile];

    if (name === 'floor') {
      return utils.getTileFromName('box');
    }

    if (name === 'destination') {
      return utils.getTileFromName('boxInDestination');
    }

    if (process.env.NODE_ENV !== 'production') {
      throw new Error('Unexpected tile');
    }
  },

};

var { $ } = utils;
var canvas = $('canvas')[0];

utils.context = canvas.getContext('2d');

module.exports = utils;
