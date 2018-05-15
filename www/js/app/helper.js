// @flow

/* global window */

import FastClick from 'fastclick';
import TWEEN from '@tweenjs/tween.js';

export function initializeEnvironment() {
    FastClick.attach(window.document.body);

    (function animate() {
        window.requestAnimationFrame(animate);
        TWEEN.update();
    })();
}
