// @flow

/* global window, document, Image, setTimeout, requestAnimationFrame */

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

type ScaledImageDataType = {|
    width: number,
    height: number,
    base64Image: string,
    src: string
|};

export const imageCache: Array<ScaledImageDataType> = [];

function loadImage(src: string): Promise<Image | null> {
    return new Promise((resolve: (image: Image) => void, reject: () => void) => {
        const image = new Image();

        image.addEventListener(
            'load',
            () => {
                requestAnimationFrame((): void => resolve(image));
            },
            false
        );

        image.addEventListener(
            'error',
            () => {
                console.error('can not load image');
                requestAnimationFrame((): void => resolve(image));
            },
            false
        );

        image.src = src;
    }).catch(
        (error: Error): null => {
            console.error('can not load image');
            console.error(error);
            return null;
        }
    );
}

// eslint-disable-next-line complexity, max-statements
async function scaleImage(src: string, multiple: number): Promise<ScaledImageDataType | null> {
    const image = await loadImage(src);

    if (image === null) {
        console.error('image is null');
        return null;
    }

    const {naturalWidth, naturalHeight} = image;
    const endWidth = naturalWidth * multiple;
    const endHeight = naturalHeight * multiple;

    const maxImageSideSize = 128;

    if (naturalWidth > maxImageSideSize || naturalHeight > maxImageSideSize) {
        console.log('too big for cache', src);
        return null;
    }

    if (multiple === 1) {
        return {
            src,
            width: endWidth,
            height: endHeight,
            base64Image: src
        };
    }

    const canvas = document.createElement('canvas');

    const {body} = document;

    if (body === null) {
        console.error('body is not exist');
        return null;
    }

    const app = new PIXI.Application(endWidth, endHeight, {
        view: canvas,
        autoStart: false,
        clearBeforeRender: false,
        sharedTicker: false,
        sharedLoader: true,
        transparent: true,
        preserveDrawingBuffer: true,
        resolution: window.devicePixelRatio || 1
    });

    const sprite = PIXI.Sprite.fromImage(src);

    sprite.width = endWidth;
    sprite.height = endHeight;

    app.stage.addChild(sprite);

    return new Promise((resolve: (scaledImageData: ScaledImageDataType) => void) => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                app.render();

                const base64Image = app.renderer.view.toDataURL();

                app.destroy();

                resolve({
                    src,
                    width: endWidth,
                    height: endHeight,
                    base64Image
                });
            });
        });
    });
}

async function cacheScaledImage(src: string): Promise<void> {
    const imageScale1 = await scaleImage(src, 1);
    const imageScale2 = await scaleImage(src, 2);

    if (imageScale1 === null || imageScale2 === null) {
        console.error('error with image scaling');
        return;
    }

    imageCache.push(imageScale1, imageScale2);
}

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
        imageList.forEach((base64Data: string) => {
            imageQueue.push(async (): Promise<void> => cacheScaledImage(base64Data));
        });
        imageQueue.push(() => {
            console.log('image loaded');
            resolve();
        });
    });
}
