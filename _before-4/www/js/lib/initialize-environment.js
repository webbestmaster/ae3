// @flow
/* global window */

// polyfill
// require('./polyfill/es5-shim');
require('./polyfill/es5-sham');
require('./polyfill/json3');
require('./polyfill/es6-shim');
require('./polyfill/es6-sham.min');
require('./polyfill/es7-shim');

require('es6-promise').polyfill();

import FastClick from 'fastclick';

function initializeEnvironment():void {
    const doc = window.document;

    FastClick.attach(doc.body);
}

initializeEnvironment();

module.exports = initializeEnvironment;
