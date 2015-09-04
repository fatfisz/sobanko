'use strict';

var assign = require('object-assign');

var { tileSize, tiles } = require('./constants');


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

assign(Object.getPrototypeOf(exports.context), {

  basedRotate(x, y, direction) {
    switch (direction) {
      case 'down':
        this.transform(-1, 0, 0, -1, (x + 1) * tileSize, (y + 1) * tileSize);
        break;
      case 'left':
        this.transform(0, -1, 1, 0, x * tileSize, (y + 1) * tileSize);
        break;
      case 'right':
        this.transform(0, 1, -1, 0, (x + 1) * tileSize, y * tileSize);
        break;
      default:
        this.transform(1, 0, 0, 1, x * tileSize, y * tileSize);
        break;
    }
  },

  roundedRect(x1, y1, x2, y2, radius) {
    var halfX = (x1 + x2) / 2;
    var halfY = (y1 + y2) / 2;

    this.beginPath();
    this.moveTo(x1, halfY);
    this.arcTo(x1, y1, halfX, y1, radius);
    this.arcTo(x2, y1, x2, halfY, radius);
    this.arcTo(x2, y2, halfX, y2, radius);
    this.arcTo(x1, y2, x1, halfY, radius);
    this.closePath();
  },

  circle(x, y, radius) {
    this.beginPath();
    this.arc(x, y, radius, 0, 2 * Math.PI);
  },

});
