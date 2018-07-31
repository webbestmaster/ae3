// @flow

/* global window, Image, setTimeout */

import FastClick from 'fastclick';
import TWEEN from '@tweenjs/tween.js';

import {run as runLocalServer} from '../module/server-local-api';
import {run as runLocalSocket} from '../module/socket-local';
import * as PIXI from 'pixi.js';
import Queue from '../lib/queue';

const allImageReqContext = require.context('./../../', true, /\.png$/);

const imageList: Array<string> = [];

allImageReqContext.keys().forEach((fileName: string) => {
    imageList.push(allImageReqContext(fileName));
});

function loadImage(src: string): Promise<void> {
    return new Promise((resolve: () => void, reject: () => void) => {
        const image = new Image();

        image.addEventListener(
            'load',
            () => {
                PIXI.Sprite.fromImage(src);
                setTimeout(resolve, 0);
            },
            false
        );

        image.addEventListener(
            'error',
            () => {
                console.error('can not load image');
                setTimeout(resolve, 0);
            },
            false
        );

        image.src = src;
    }).catch((error: Error) => {
        console.error('can not load image');
        console.error(error);
    });
}

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

    const imageQueue = new Queue();

    await new Promise((resolve: () => void) => {
        imageList.forEach((base64Data: string, index: number) => {
            imageQueue.push(
                (): Promise<void> => {
                    console.log('load', index, '/', imageList.length);
                    return loadImage(base64Data);
                }
            );
        });
        imageQueue.push(() => {
            console.log('image loaded');
            resolve();
        });
    });
}
