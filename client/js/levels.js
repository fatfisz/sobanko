'use strict';

var bulk = require('bulk-require');

var levelsBulk = bulk(__dirname + '/../levels', ['*']);
var levels = [];

Object.keys(levelsBulk).forEach((levelId) => {
  levels[levelId] = levelsBulk[levelId];
});

module.exports = levels;
