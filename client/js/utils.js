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

  opposite: {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left',
  },

  directionToIndex: {
    up: 1,
    down: 1,
    left: 0,
    right: 0,
  },

  directionToDirectionMod: {
    up: -1,
    down: 1,
    left: -1,
    right: 1,
  },

  getTargetPosition(direction, pos) {
    var result = pos.slice();
    var index = exports.directionToIndex[direction];
    var directionMod = exports.directionToDirectionMod[direction];

    result[index] += directionMod;

    return result;
  },

  getBoxPosition(direction, pos) {
    var result = pos.slice();
    var index = exports.directionToIndex[direction];
    var directionMod = exports.directionToDirectionMod[direction];

    result[index] -= directionMod;

    return result;
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
