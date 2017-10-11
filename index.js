'use strict';

// Only run if this is being run client side.
if (typeof Java === "undefined") {
  module.exports = require('./js/progressive-pushstate.js');
}
