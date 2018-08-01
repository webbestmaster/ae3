// @flow

/* global window, document, Image, setTimeout, requestAnimationFrame */

import FastClick from 'fastclick';
import TWEEN from '@tweenjs/tween.js';

import {run as runLocalServer} from '../module/server-local-api';
import {run as runLocalSocket} from '../module/socket-local';
import {initImages} from './helper-image';
import {socket} from '../module/socket';
import type {LoadAppPassedMethodMapType} from '../components/app-loader';

// eslint-disable-next-line max-statements
export async function initializeEnvironment(methodMap: LoadAppPassedMethodMapType): Promise<void> {
    const {body} = document;

    methodMap.addItem('setMobileEnv', 'SPACE');
    methodMap.setItemProgress('setMobileEnv', 0, 4);

    if (body !== null) {
        // reduce 300ms delay
        FastClick.attach(body);
    } else {
        methodMap.onErrorItem('setMobileEnv');
        console.error('document.body is not define');
    }

    methodMap.setItemProgress('setMobileEnv', 1, 4);

    // run Tween.js updater
    (function animate() {
        window.requestAnimationFrame(animate);
        TWEEN.update();
    })();

    methodMap.setItemProgress('setMobileEnv', 2, 4);

    // disable gesture zoom on iOS
    document.addEventListener('gesturestart', (evt: Event) => {
        evt.preventDefault();
    });

    methodMap.setItemProgress('setMobileEnv', 3, 4);

    // disable extra scroll on iOS, use Scroll component
    document.addEventListener(
        'touchmove',
        (evt: Event) => {
            evt.preventDefault();
        },
        false
    );

    methodMap.setItemProgress('setMobileEnv', 4, 4);
    methodMap.onLoadItem('setMobileEnv');

    methodMap.addItem('initServerSocket', 'SPACE');
    methodMap.setItemProgress('initServerSocket', 0, 1);

    await socket
        .initSocket()
        .then((): void => console.log('Socket has been connect.'))
        .catch((error: Error) => {
            methodMap.onErrorItem('initServerSocket');
            console.log('Socket has NOT been connect.');
            console.error(error);
        });

    methodMap.setItemProgress('initServerSocket', 1, 1);
    methodMap.onLoadItem('initServerSocket');

    methodMap.addItem('runLocalServer', 'SPACE');
    methodMap.setItemProgress('runLocalServer', 0, 1);

    await runLocalServer()
        .then((): void => console.log('Local Server has been run.'))
        .catch((error: Error) => {
            methodMap.onErrorItem('runLocalServer');
            console.log('Local Server has NOT been run.');
            console.error(error);
        });

    methodMap.setItemProgress('runLocalServer', 1, 1);
    methodMap.onLoadItem('runLocalServer');

    methodMap.addItem('runLocalSocket', 'SPACE');
    methodMap.setItemProgress('runLocalSocket', 0, 1);

    await runLocalSocket()
        .then((): void => console.log('Local Socket has been connect.'))
        .catch((error: Error) => {
            methodMap.onErrorItem('runLocalSocket');
            console.log('Local Socket has NOT been connect.');
            console.error(error);
        });

    methodMap.setItemProgress('runLocalSocket', 1, 1);
    methodMap.onLoadItem('runLocalSocket');

    await initImages(methodMap);
}
