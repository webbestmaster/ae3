// @flow

/* global window */

import FastClick from 'fastclick';
import TWEEN from '@tweenjs/tween.js';

import {run as runLocalServer} from '../module/server-local-api';
import {run as runLocalSocket} from '../module/socket-local';

export async function initializeEnvironment(): Promise<void> {
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

    await runLocalServer()
        .then(() => {
            console.log('Local Server has been run.');
        });

    await runLocalSocket()
        .then(() => {
            console.log('Local Socket has been run.');
        });
}
