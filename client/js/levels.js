'use strict';

var bulk = require('bulk-require');


var levelsBulk = bulk(__dirname + '/../levels', ['*']);

module.exports = Object.keys(levelsBulk).map(
  (levelId) => levelsBulk[levelId]
);
