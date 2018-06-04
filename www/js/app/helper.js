// @flow

/* global window */

import FastClick from 'fastclick';
import TWEEN from '@tweenjs/tween.js';

export function initializeEnvironment() {
    const {document} = window;

    // reduce 300ms delay
    FastClick.attach(window.document.body);

    (function animate() {
        window.requestAnimationFrame(animate);
        TWEEN.update();
    })();

    // disable gesture zoom on iOS
    document.addEventListener('gesturestart', (evt: Event) => {
        evt.preventDefault();
    });
}
