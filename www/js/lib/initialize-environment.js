// polyfill
// require('./polyfill/es5-shim');
require('./polyfill/es5-sham');
require('./polyfill/json3');
require('./polyfill/es6-shim');
require('./polyfill/es6-sham.min');
require('./polyfill/es7-shim');

/* global window */
import es6Promise from 'es6-promise';
es6Promise.polyfill();

import FastClick from 'fastclick';

function initializeEnvironment() {
    const doc = window.document;

    FastClick.attach(doc.body);
}

initializeEnvironment();

module.exports = initializeEnvironment;
