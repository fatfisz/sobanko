/*
 * Sobanko
 * https://github.com/fatfisz/sobanko
 *
 * Copyright (c) 2015 FatFisz
 * Licensed under the MIT license.
 */

'use strict';

var bulk = require('bulk-require');


var levelsBulk = bulk(__dirname + '/../levels', ['*']);

module.exports = Object.keys(levelsBulk).map(
  (levelId) => levelsBulk[levelId]
);
