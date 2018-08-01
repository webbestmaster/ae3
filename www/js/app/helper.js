// @flow

/* global window, document, Image, setTimeout, requestAnimationFrame */

import FastClick from 'fastclick';
import TWEEN from '@tweenjs/tween.js';

import {run as runLocalServer} from '../module/server-local-api';
import {run as runLocalSocket} from '../module/socket-local';
import {initImages} from './helper-image';
import {socket} from './../module/socket';

export async function initializeEnvironment(): Promise<void> {
    // reduce 300ms delay
    if (document.body !== null) {
        FastClick.attach(document.body);
    }

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

    await socket.initSocket()
        .then((): void => console.log('Socket has been connect.'))
        .catch((error: Error) => {
            console.log('Socket has NOT been connect.');
            console.error(error);
        });

    await runLocalServer()
        .then((): void => console.log('Local Server has been run.'))
        .catch((error: Error) => {
            console.log('Local Server has NOT been run.');
            console.error(error);
        });

    await runLocalSocket()
        .then((): void => console.log('Local Socket has been connect.'))
        .catch((error: Error) => {
            console.log('Local Socket has NOT been connect.');
            console.error(error);
        });

    await initImages();
}
