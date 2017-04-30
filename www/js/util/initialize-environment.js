import es6Promise from 'es6-promise';
es6Promise.polyfill();

import FastClick from 'fastclick';

import injectTapEventPlugin from 'react-tap-event-plugin';

export default function initializeEnvironment() {
    const doc = window.document;

    injectTapEventPlugin();

    FastClick.attach(doc.body);
}
