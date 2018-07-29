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

    // run Tween.js updater
    (function animate() {
        window.requestAnimationFrame(animate);
        TWEEN.update();
    })();

    // disable gesture zoom on iOS
    document.addEventListener('gesturestart', (evt: Event) => {
        evt.preventDefault();
    });

    // disable extra scroll on iOS, use Scroll component
    document.addEventListener(
        'touchmove',
        (evt: Event) => {
            evt.preventDefault();
        },
        false
    );

    await runLocalServer()
        .then((): void => console.log('Local Server has been run.'))
        .catch((error: Error) => {
            console.log('Local Server has NOT been run.');
            console.error(error);
        });

    await runLocalSocket()
        .then((): void => console.log('Local Socket has been run.'))
        .catch((error: Error) => {
            console.log('Local Socket has NOT been run.');
            console.error(error);
        });
}
